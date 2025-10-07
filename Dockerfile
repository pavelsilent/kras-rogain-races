# ---------- Stage 1: Backend Build & OpenAPI ----------
FROM eclipse-temurin:17 AS backend-builder
WORKDIR /app

# Копируем Spring Boot проект (корень)
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

RUN chmod +x gradlew
# Собираем backend и генерируем OpenAPI JSON (профиль openapi)
RUN ./gradlew clean build generateOpenApiDocs -Dspring.profiles.active=openapi -x test


# ---------- Stage 2: Frontend Build & DTO ----------
FROM node:20 AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .

# Копируем сгенерированный openapi.json из backend
COPY --from=backend-builder /app/build/openapi/openapi.json ./openapi.json

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL:-https://fallback-url.com}
RUN echo "=== [Build ARG] API_BASE_URL=${API_BASE_URL} ==="

# Установка Java (требуется для openapi-generator-cli)
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    rm -rf /var/lib/apt/lists/*

RUN npm install @openapitools/openapi-generator-cli -g
RUN sed -i "s#http://localhost:7777#${API_BASE_URL}#g" src/environments/environment.prod.ts

# Генерация Angular DTO и сервисов через кастомный шаблон
RUN openapi-generator-cli generate \
  -i ./openapi.json \
  -g typescript-angular \
  -c ./openapi-generator-config.json \
  -o src/app/api \
  -t ./templates \
  --skip-validate-spec

# Сборка фронта с production конфигурацией
RUN npm run build -- --configuration production

# ---------- Stage 3: Backend Final Build with Frontend ----------
FROM eclipse-temurin:17 AS final-backend
WORKDIR /app

# Копируем исходники backend для сборки финального jar
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

RUN chmod +x gradlew

# Копируем собранную фронт-статику в ресурсы backend
COPY --from=frontend-builder /app/client/dist/krsk-rogain-results-front/browser ./src/main/resources/static

# Собираем финальный jar с фронтом
RUN ./gradlew clean build -x test

# ---------- Stage 4: Runtime ----------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Копируем финальный jar
COPY --from=final-backend /app/build/libs/*.jar app.jar

EXPOSE 80
ENTRYPOINT ["sh", "-c", "java -Dserver.port=80 -Dserver.address=0.0.0.0 -Dlogging.level.root=INFO -jar app.jar --spring.profiles.active=prod; sleep 600"]
