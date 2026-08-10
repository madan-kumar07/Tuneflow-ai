# TuneFlow AI

> A full-stack music streaming and discovery platform with secure JWT authentication, song management, and YouTube-powered music search.

## 2. Live Demo / Video Demo

> **Review-I status:** Live deployment and video demo are planned for the later review phase. No unavailable or placeholder URL is presented as a working link.

- **Live Demo:** To be added during deployment phase
- **Video Demo:** To be added during demo phase

## 3. Overview

TuneFlow AI is a full-stack music streaming and discovery application designed to provide users with a simple and secure way to discover, manage, and play music.

The application provides user registration and login with JWT-based authentication, protected REST APIs, song management, YouTube-powered music search, and a React-based user interface. The backend follows a layered Spring Boot architecture with controllers, services, repositories, and domain entities backed by PostgreSQL.

The project is being developed as an academic capstone project following an industry-oriented software development workflow with documented architecture, database design, version control, and review checkpoints.

## 4. Architecture Diagram

TuneFlow AI follows a layered full-stack architecture:

```text
User
  |
  v
React Frontend
  |
  | REST API + JWT
  v
Spring Boot REST API
  |
  +--> JWT / Spring Security
  |
  +--> Service Layer
  |       |
  |       v
  |    Repository Layer
  |       |
  |       v
  |    PostgreSQL
  |
  +--> YouTube Service
          |
          v
     YouTube Data API
```

### Architecture Diagram

![TuneFlow AI Architecture Diagram](docs/diagrams/architecture-diagram-v1.png)

Editable architecture source:

`docs/diagrams/architecture-diagram-v1.drawio`

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| Authentication | JWT, Spring Security |
| API Documentation | Swagger / OpenAPI |
| External Service | YouTube Data API |
| Build Tool | Maven |
| Package Management | npm |
| Version Control | Git & GitHub |
| API Testing | Swagger UI / browser-based API testing |

## 6. Features

### Authentication Module

- User registration
- User login
- Password-based authentication
- JWT token generation
- JWT token validation
- Protected backend APIs
- Spring Security integration
- Role-based user structure
- Frontend authentication state
- Protected frontend routes

### Song Module

- Create songs
- Retrieve all songs
- Retrieve a song by ID
- Update songs
- Delete songs
- Store song metadata in PostgreSQL
- Song information such as title, artist, album, genre, duration, image URL, and audio URL

### YouTube Integration

- Search music using the YouTube Data API
- Retrieve YouTube search results
- Process external API responses through the backend
- Display search results through the frontend

### User Experience

- Login page
- Registration page
- Home page
- Song listing
- Search interface
- Music player
- Protected application routes
- Recently played state
- Liked songs state

### Backend Architecture

- REST Controllers
- Service Layer
- Repository Layer
- Entity / Domain Layer
- JWT Security Module
- Global API response/error handling

## 7. Screenshots

Key application screenshots will be maintained here as the UI is finalized.

### Authentication

> Add the final Login / Register screenshot here.

```text
docs/screenshots/login.png
```

### Home / Music Interface

> Add the final Home / Music Player screenshot here.

```text
docs/screenshots/home.png
```

### Song Search

> Add the final Song Search screenshot here.

```text
docs/screenshots/search.png
```

> **Review-I note:** Screenshot files should be added only when the corresponding UI is finalized. Broken image links should not be committed.

## 8. Getting Started

### 8.1 Prerequisites

Install the following before running the project:

- Java JDK
- Maven
- Node.js
- npm
- PostgreSQL
- Git
- A YouTube Data API key

Verify the installations:

```bash
java -version
mvn -version
node -v
npm -v
psql --version
git --version
```

### 8.2 Clone the Repository

```bash
git clone https://github.com/madan-kumar07/Tuneflow-ai.git
cd TuneFlow-ai
```

> Replace `<https://github.com/madan-kumar07/Tuneflow-ai.git>` with the actual repository URL before the final submission.

### 8.3 Database Setup

Create a PostgreSQL database for TuneFlow AI.

Example:

```sql
CREATE DATABASE tuneflow;
```

Make sure PostgreSQL is running before starting the backend.

### 8.4 Backend Configuration

The backend must receive database, JWT, and YouTube configuration through environment variables or local configuration.

Required values:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
YOUTUBE_API_KEY
```

Do not commit real credentials.

### 8.5 Run the Backend

Open a terminal in the backend project directory:

```bash
cd backend
```

Run the Spring Boot application:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### macOS / Linux

```bash
./mvnw spring-boot:run
```

If Maven Wrapper is not available, use:

```bash
mvn spring-boot:run
```

The backend runs on the configured Spring Boot port, normally:

```text
http://localhost:8080
```

### 8.6 Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

### 8.7 Basic Run Order

Use this order when starting the complete application:

```text
1. Start PostgreSQL
        |
        v
2. Start Spring Boot backend
        |
        v
3. Start React frontend
        |
        v
4. Open the frontend in the browser
        |
        v
5. Register / Login
        |
        v
6. Test protected APIs and music features
```

## 9. Environment Variables

The following configuration values are required for local execution.

| Variable | Description | Required |
|---|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL | Yes |
| `DB_USERNAME` | PostgreSQL database username | Yes |
| `DB_PASSWORD` | PostgreSQL database password | Yes |
| `JWT_SECRET` | Secret used for signing and validating JWT tokens | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API key used for music search | Yes |

### Example Local Configuration

Use your local environment/configuration mechanism to provide these values.

```text
DB_URL=jdbc:postgresql://localhost:5432/tuneflow
DB_USERNAME=<your_database_username>
DB_PASSWORD=<your_database_password>
JWT_SECRET=<your_local_jwt_secret>
YOUTUBE_API_KEY=<your_youtube_api_key>
```

**Never commit actual secrets, passwords, or API keys to GitHub.**

The real local environment file must remain excluded through `.gitignore`.

## 10. API Documentation

TuneFlow AI uses Swagger / OpenAPI for backend API documentation.

After starting the Spring Boot backend, open the Swagger UI URL configured by the application.

Typical local Swagger UI URL:

```text
http://localhost:8080/swagger-ui/index.html
```

### Authentication APIs

```text
POST /auth/register
POST /auth/login
```

### Song APIs

```text
GET    /api/songs
GET    /api/songs/{id}
POST   /api/songs
PUT    /api/songs/{id}
DELETE /api/songs/{id}
```

### YouTube API

```text
GET /api/youtube/search
```

### Authentication Flow

```text
Register / Login
       |
       v
Spring Boot Authentication
       |
       v
JWT Token
       |
       v
Frontend stores authentication state
       |
       v
JWT sent with protected API requests
       |
       v
Spring Security validates JWT
```

Protected endpoints require a valid JWT in the request:

```text
Authorization: Bearer <JWT_TOKEN>
```

> The hosted Swagger URL will be added after deployment. The local Swagger URL above is for development and Review-I testing.

## 11. Running Tests

### Backend Tests

Run the Spring Boot test suite from the backend directory:

### Windows

```bash
mvnw.cmd test
```

### macOS / Linux

```bash
./mvnw test
```

Or, if Maven is installed globally:

```bash
mvn test
```

### Manual API Verification

For the current MVP, the following flows should also be verified manually through Swagger UI or the frontend:

#### Flow 1 — Authentication

```text
Register
   |
   v
Login
   |
   v
JWT generated
   |
   v
Use JWT on protected endpoint
   |
   v
Successful authenticated response
```

#### Flow 2 — Song Management

```text
Song request
   |
   v
SongController
   |
   v
SongService
   |
   v
SongRepository
   |
   v
PostgreSQL
   |
   v
Song response
```

### Test Expectations

Before merging changes:

- Backend builds successfully
- Existing tests pass
- Authentication flow works
- Protected endpoints reject unauthenticated requests
- Song API requests work with valid authentication
- No unhandled browser errors are present

## 12. Deployment

### Review-I Status

The current Review-I version is focused on a working local MVP and documented architecture.

Cloud deployment, production hosting, CI/CD, and the live demo URL will be documented when those stages are completed.

### Current Local Deployment Model

```text
React Frontend
     |
     v
Local Development Server

Spring Boot Backend
     |
     v
Local Spring Boot Server
     |
     v
PostgreSQL
```

### Future Production Deployment

The final deployment section will be updated with:

- Frontend hosting platform
- Backend hosting platform
- PostgreSQL hosting platform
- Production environment variables
- CI/CD workflow
- Live application URL
- Deployment steps

> No hosting platform or live URL is claimed here until the deployment is actually completed and verified.

## 13. Folder Structure

The project follows a frontend/backend/docs separation.

```text
TuneFlow-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── tuneflow/
│   │   │   │           └── backend/
│   │   │   │               ├── config/
│   │   │   │               ├── controller/
│   │   │   │               ├── service/
│   │   │   │               ├── repository/
│   │   │   │               ├── entity/
│   │   │   │               ├── security/
│   │   │   │               └── ...
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── docs/
│   └── diagrams/
│       ├── architecture-diagram-v1.png
│       ├── architecture-diagram-v1.drawio
│       ├── ER_Diagram_v1.png
│       ├── ER_Diagram_v1.dbml
│       ├── class-module-diagram-v1.png
│       └── class-module-diagram-v1.drawio
│
├── Problem_Statement.md
├── README.md
├── .gitignore
└── ...
```

> Keep this tree synchronized with the actual repository. Remove any folder or file from the documentation if it does not exist in the final repository.

## 14. Future Enhancements

The following improvements are planned for later development phases:

- Cloud deployment
- Production environment configuration
- CI/CD using GitHub Actions
- Automated unit and integration testing
- Improved music playback experience
- Advanced search and filtering
- Enhanced user playlists
- Improved liked-song management
- Listening history improvements
- AI-powered music recommendation features
- Additional security hardening
- Application monitoring and health checks
- UI/UX improvements for mobile and desktop
- Production API documentation

## 15. License

This project is developed as an academic capstone project for educational purposes.

A final open-source license will be selected and added before the project is released publicly.

## 16. Author / Contact

### Author

**MadanKumar A**

B.E. Computer Science and Engineering  
J.J. College of Engineering and Technology

### Project

**TuneFlow AI**

GitHub Repository:

```text
https://github.com/madan-kumar07/Tuneflow-ai.git
```

> Add the final repository URL and any preferred contact information before the final submission.
