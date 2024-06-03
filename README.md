# Backend Developer Assignment - FlytBase

## Overview
This repository contains the completed assignment for the Backend Developer role at FlytBase. The project implements backend CRUD services to manage users, drones, missions, and sites, as well as additional features outlined in the assignment document.

## Project Structure
- **src/**: Contains the source code for the application.
- **common/**: Configuration files for the application.
- **Dockerfile**: Docker configuration for containerizing the application.
- **docker-compose.yml**: Docker Compose configuration for running the application with PostgreSQL.
- **README.md**: Instructions for setting up and running the application.

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **NestJS**: Preferred framework for building scalable server-side applications.
- **PostgreSQL**: Relational database for storing data.
- **Prisma**: Next-generation ORM for PostgreSQL.
- **TypeScript**: Strongly typed superset of JavaScript.
- **JWT**: JSON Web Tokens for API authentication.
- **Docker**: Containerization tool for deploying the application.

## Prerequisites
- **Node.js** (v21 or higher)
- **PostgreSQL** (v13 or higher)
- **Docker** (optional, if using containerization)

## Note on Database Choice
Although the assignment specified the use of MongoDB, I chose to implement the backend services using PostgreSQL with Prisma ORM. Here are the reasons for this choice:

1. **Relational Data Modeling**: The problem statement involved managing complex relationships between users, drones, missions, and sites. PostgreSQL, being a relational database, is well-suited for handling such data relationships efficiently and with strong data integrity through foreign keys and constraints.

2. **Data Consistency**: PostgreSQL provides ACID (Atomicity, Consistency, Isolation, Durability) compliance, which ensures reliable transactions and data consistency. This is crucial for operations such as user authentication, mission updates, and drone assignments, where data integrity is paramount.

3. **Prisma ORM**: Prisma offers a robust and type-safe way to interact with the database. It simplifies complex queries, ensures type safety, and improves developer productivity. Prisma's migration system also makes it easier to manage schema changes over time.

4. **Scalability**: PostgreSQL is a powerful, open-source database that can handle large volumes of data and complex queries efficiently. It also offers extensive indexing, advanced querying capabilities, and support for various data types, making it a versatile choice for this application.

5. **Industry Adoption**: PostgreSQL is widely adopted in the industry for enterprise applications due to its reliability, performance, and extensive feature set. Experience with PostgreSQL and Prisma ORM is also highly valuable in many backend development roles.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Abhishek-nimbalkar/AbhishekNimbalkar_Flytbase_Assignment.git
cd AbhishekNimbalkar_Flytbase_Assignment 
```

### 2.  Install Dependencies
```bash
npm install 
```
### 3.  Configure Environment Variables (env.example)
```bash
PORT="5000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nest_drone"
JWT_SECRET="secret"
JWT_EXPIRATION="100h"
```
## 4. Run the Application
### Without Docker:
```bash
npm run start:dev
```
### With Docker Compose:
```bash
docker compose up --build
```
## 5. Access the API
The server will be running at `http://localhost:8000`.

### Postman Collection
The Postman collection for testing the APIs is available at the following link:

[Postman Collection](https://documenter.getpostman.com/view/32590746/2sA3QwcqKk)

### How to Use the Postman Collection
1. **Import the Collection**:
   - Download the Postman collection JSON file from the link above.
   - Open Postman and go to the `File` menu, then select `Import`.
   - Choose the downloaded JSON file to import the collection.

2. **Set Up the Environment**:
   - Create a new environment in Postman with the following variables:
     - `base_url`: `http://localhost:8000`
     - `jwt_token`: Leave this empty for now; it will be filled after authentication.

3. **Authenticate/SingUp**:
- Use the `SignUp` endpoint in the Postman collection under user folder in auth to create user if not existed.
   - Use the `Login` endpoint in the Postman collection under user folder in auth to authenticate and obtain a JWT token.
   - jwt token will be updated in variables.


4. **Make API Requests**:
   - Ensure the environment with `base_url` and `jwt_token` is selected.
   - The collection is structured into folders for different resources:
     - `User`:
       - Contains endpoints for user-related CRUD operations.
     - `Site`:
       - Contains endpoints for site-related CRUD operations.
     - `Drone`:
       - Contains endpoints for drone-related CRUD operations.
     - `Category`:
       - Contains endpoints for category-related CRUD operations.
     - `User/Site`:
       - Contains endpoints for retrieving users and sites.
     - `User/Site/Drone`:
          - Contains endpoints for drone-related operations under a specific user or site.
     - `User/Site/Mission`:
       - Contains endpoints for mission-related operations under a specific user or site.

5. **Explore the Endpoints**:
- You can create, read, update, and delete resources using the provided endpoints in their respective folders.



