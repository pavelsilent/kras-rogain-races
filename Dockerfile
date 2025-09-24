# Stage 1: Build Angular
FROM node:20 AS frontend-builder
WORKDIR /
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build -- --configuration production

# Stage 2: Build Spring Boot
FROM eclipse-temurin:17 AS backend-builder
WORKDIR /
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .

# ⚡ Дать права на исполнение gradlew
RUN chmod +x gradlew

RUN ./gradlew clean build -x test

# Stage 3: Final runtime image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Копируем JAR из предыдущего stage
COPY --from=backend-builder /build/libs/*.jar app.jar
# Копируем Angular сборку
COPY --from=frontend-builder /client/dist/krsk-rogain-results-front/browser /app/static
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
