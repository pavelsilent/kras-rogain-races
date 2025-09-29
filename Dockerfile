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

RUN npm install @openapitools/openapi-generator-cli -g

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

# ---------- Stage 3: Runtime ----------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Копируем backend jar
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# Копируем собранный фронт
COPY --from=frontend-builder /app/client/dist/krsk-rogain-results-front/browser src/main/resources/static

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
