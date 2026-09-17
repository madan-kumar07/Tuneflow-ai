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

## 9. Environment Variables & Production Deployment

### 9.1 Environment Variables Table

#### Backend Environment Variables (Render / Railway)

| Variable | Description | Required | Target Platform |
|---|---|---|---|
| `PORT` | Dynamic port provided by server | Auto | Render |
| `DATABASE_URL` | Full PostgreSQL connection string | Yes | Railway / Render |
| `DB_URL` | Alternative PostgreSQL JDBC connection URL | Optional | Render |
| `DB_USERNAME` | PostgreSQL database username | Yes | Railway / Render |
| `DB_PASSWORD` | PostgreSQL database password | Yes | Railway / Render |
| `JWT_SECRET` | Secret key for signing/validating JWT tokens | Yes | Render |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend URLs | Yes | Render |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | Yes | Render |
| `MAIL_HOST` | SMTP server host (e.g. `smtp.gmail.com`) | Yes | Render |
| `MAIL_PORT` | SMTP server port (e.g. `587`) | Yes | Render |
| `MAIL_USERNAME` | SMTP email address | Yes | Render |
| `MAIL_PASSWORD` | SMTP app password | Yes | Render |
| `MAIL_FROM` | Sender email address | Yes | Render |

#### Frontend Environment Variables (Vercel)

| Variable | Description | Required | Target Platform |
|---|---|---|---|
| `VITE_API_BASE_URL` | Deployed Spring Boot backend API URL (e.g. `https://tuneflow-backend.onrender.com`) | Yes | Vercel |

### 9.2 Production Deployment Guide

#### 1. Railway (PostgreSQL Database)
1. Log in to [Railway.app](https://railway.app) and create a new PostgreSQL database instance.
2. Note the generated database variables: `DATABASE_URL` or `HOST`, `PORT`, `DATABASE`, `USER`, `PASSWORD`.

#### 2. Render (Spring Boot Backend)
1. Log in to [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository `madan-kumar07/Tuneflow-ai` and set Root Directory to `backend`.
3. Set Build Command: `./mvnw clean package -DskipTests`
4. Set Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5. Configure Environment Variables in Render Dashboard:
   - `DATABASE_URL` (from Railway)
   - `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS` (e.g. `https://your-app.vercel.app`)
   - `YOUTUBE_API_KEY`
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`

#### 3. Vercel (React Frontend)
1. Log in to [Vercel.com](https://vercel.com) and import `madan-kumar07/Tuneflow-ai`.
2. Set Root Directory to `frontend`.
3. Set Environment Variables in Vercel Dashboard:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
4. Deploy. SPA rewrites are automatically configured via `frontend/vercel.json`.

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
