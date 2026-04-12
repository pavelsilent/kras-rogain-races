# ---------- Stage 1: Backend Build + OpenAPI + DTO ----------
FROM eclipse-temurin:17 AS backend-builder
WORKDIR /app

# Копируем Spring Boot проект (корень)
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

RUN chmod +x gradlew

# Генерируем OpenAPI + DTO (Java уже есть)
RUN ./gradlew generateOpenApiDocs -Dspring.profiles.active=openapi -x test

# Скачиваем OpenAPI generator (один раз)
RUN curl -L https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.21.0/openapi-generator-cli-7.21.0.jar -o generator.jar

# Генерация Angular API
RUN java -jar generator.jar generate \
  -i build/openapi/openapi.json \
  -g typescript-angular \
  -c src/main/resources/openapi-generator-config.json \
  -o /generated-api \
  -t src/main/resources/templates \
  --skip-validate-spec


# ---------- Stage 2: Frontend (ЧИСТЫЙ Node) ----------
FROM node:20-slim AS frontend-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ .

# Копируем СГЕНЕРИРОВАННЫЙ API
COPY --from=backend-builder /generated-api ./src/app/api

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL:-https://fallback-url.com}

RUN sed -i "s#http://localhost:7777#${API_BASE_URL}#g" src/environments/environment.prod.ts

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

RUN ./gradlew build -x test

# ---------- Stage 4: Runtime ----------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Копируем финальный jar
COPY --from=final-backend /app/build/libs/*.jar app.jar

EXPOSE 80
ENTRYPOINT ["sh", "-c", "java -Dserver.port=80 -Dserver.address=0.0.0.0 -Dlogging.level.root=INFO -jar app.jar --spring.profiles.active=prod; sleep 600"]
