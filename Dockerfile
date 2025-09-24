# Stage 1: Build Angular
FROM node:20 AS frontend-builder
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build -- --configuration production

# Stage 2: Build Spring Boot + copy Angular
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Копируем Spring Boot JAR
COPY build/libs/krsk-rogain-races-0.0.1-SNAPSHOT app.jar
# Копируем Angular сборку в static
COPY --from=frontend-builder /client/dist/krsk-rogain-results-front/browser /app/static
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
