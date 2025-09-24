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

# Копируем Angular сборку в resources/static
COPY --from=frontend-builder /app/client/dist/krsk-rogain-results-front/browser src/main/resources/static

RUN chmod +x gradlew
RUN ./gradlew clean build -x test

# Stage 3: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=backend-builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
