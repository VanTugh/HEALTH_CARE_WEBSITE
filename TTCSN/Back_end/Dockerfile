# Bước 1: Build source code bằng Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng bằng Java (THAY ĐỔI TẠI ĐÂY)
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
# Copy file jar từ bước build
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]