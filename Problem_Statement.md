# Problem Statement

## 1. Title

TuneFlow AI – Music Streaming Platform with Playlist & Discovery

---

## 2. Domain

Music Streaming Platform (Entertainment Technology)

---

## 3. Who is the user? (2–3 user types, with roles)

### 1. User (Listener)
- Register and login securely.
- Browse songs, albums, artists, and genres.
- Stream music online.
- Search songs and artists.
- Create and manage playlists.
- Add songs to favorites.
- View listening history.
- Receive AI-based music recommendations.

### 2. Admin
- Manage users.
- Upload, update, and delete songs.
- Manage artists, albums, and genres.
- Monitor platform usage.
- Moderate inappropriate content.
- View analytics dashboard.

---

## 4. What problem are we solving?

Many music streaming platforms provide excellent music discovery features, but building such a system requires the integration of user authentication, playlist management, recommendation logic, cloud deployment, and secure REST APIs.

This project aims to develop a complete full-stack music streaming platform where users can securely access music, organize playlists, and discover new songs based on their listening interests. The application will also provide an administration portal for managing music content and users. As an enhancement, an AI-powered recommendation engine will improve music discovery by suggesting songs based on user behavior.

---

## 5. Proposed Solution

The proposed solution is a full-stack web application developed using React.js, Spring Boot, and MySQL.

The application will provide the following features:

- User Registration & Login
- JWT Authentication
- Browse Songs
- Artist Management
- Album Management
- Genre Management
- Search Songs
- Music Streaming
- Playlist Management
- Favorite Songs
- Listening History
- Admin Dashboard
- User Management
- Song Upload & Management
- AI Music Recommendation
- AI Playlist Generation
- Responsive User Interface
- Cloud Deployment

---

## 6. Core Entities / Database Tables

1. Users
2. Roles
3. Artists
4. Albums
5. Genres
6. Songs
7. Playlists
8. Playlist_Songs
9. Favorites
10. Listening_History

---

## 7. User Roles & Permissions

### Admin

Permissions:

- Manage Users
- Manage Songs
- Manage Artists
- Manage Albums
- Manage Genres
- View Analytics Dashboard
- Delete inappropriate content
- Monitor platform activities

### User

Permissions:

- Register
- Login
- Browse Songs
- Search Music
- Stream Songs
- Create Playlists
- Add Favorite Songs
- View Listening History
- Receive AI Recommendations
- Update Profile

---

## 8. Success Criteria

The project will be considered successful if:

- A user can register and login securely using JWT authentication.
- A user can search and stream music without errors.
- A user can create, update, and delete playlists.
- A user can manage favorite songs.
- The admin can successfully manage music content.
- The application is deployed on a public cloud URL.
- All REST APIs function correctly.
- Swagger API documentation is available.
- AI recommendation successfully suggests songs based on listening history.
- The application satisfies all Capstone Project Review requirements.

---

## 9. Out of Scope

The following features are intentionally excluded from this project:

- Offline music download
- Live chat between users
- Video streaming
- Podcast platform
- Music subscription payment gateway
- Social media integration
- Desktop application
- Mobile application
- Live concert ticket booking

---

## 10. Chosen Track

Java (Spring Boot)

Frontend:
- React.js
- Tailwind CSS
- Axios

Backend:
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- Hibernate

Database:
- MySQL 8

Authentication:
- JWT

Testing:
- JUnit 5

API Documentation:
- Swagger (OpenAPI)

CI/CD:
- GitHub Actions

Deployment:
- Frontend: Vercel
- Backend: Render
- Database: Railway MySQL
