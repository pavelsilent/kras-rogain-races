# Stage 1: Build Angular
FROM node:20 AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build -- --configuration production

# Stage 2: Build Spring Boot
FROM eclipse-temurin:17 AS backend-builder
WORKDIR /app
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/
# Даем права на gradlew
RUN chmod +x gradlew
# Собираем JAR без тестов
RUN ./gradlew clean build -x test

# Stage 3: Final runtime image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Копируем JAR
COPY --from=backend-builder /app/build/libs/*.jar app.jar
# Копируем Angular сборку
COPY --from=frontend-builder /app/client/dist/krsk-rogain-results-front/browser /app/static
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
