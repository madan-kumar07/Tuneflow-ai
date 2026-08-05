# 🎵 YouTube Music Player Integration

## Overview

This feature adds a complete YouTube music playback system to the TuneFlow AI application using the YouTube Data API v3, Spring Boot backend, and React frontend.

The player provides a Spotify-inspired experience with seamless playback controls, real-time progress tracking, autoplay functionality, and responsive UI.

---

## Features

- 🔍 Search songs using YouTube Data API v3
- ▶️ Play selected songs instantly
- ⏸️ Play / Pause controls
- ⏭️ Next song navigation
- ⏮️ Previous song navigation
- 🔊 Volume control
- ⏱️ Real-time playback progress
- ⌚ Current time & total duration
- 🎵 Automatic playback of the next song
- 🕘 Recently Played history (Local Storage)
- ❤️ Like button support
- 📱 Responsive music player interface
- 🎨 Spotify-inspired bottom player

---

## Technology Stack

### Frontend
- React.js
- Axios
- React Icons
- React YouTube

### Backend
- Spring Boot
- Java 21
- REST API

### APIs
- YouTube Data API v3
- YouTube IFrame Player API

---

## Project Structure

```
frontend/
 ├── components/
 │    ├── MusicPlayer.jsx
 │    ├── ProgressBar.jsx
 │    ├── YouTubePlayer.jsx
 │    ├── SongList.jsx
 │    ├── Sidebar.jsx
 │    └── Navbar.jsx
 │
 └── App.jsx

backend/
 ├── controller/
 ├── service/
 │    ├── SongService.java
 │    └── YoutubeService.java
 └── resources/
      └── application.properties
```

---

## Playback Flow

```
User Search
      │
      ▼
Spring Boot REST API
      │
      ▼
YouTube Data API v3
      │
      ▼
Search Results
      │
      ▼
React Music Player
      │
      ▼
YouTube IFrame Player
      │
      ▼
Music Playback
```

---

## Completed Functionality

- Search integration
- Video playback
- Playback controls
- Progress tracking
- Volume control
- Recently played
- Auto-play next song
- Responsive player layout

---

## Future Enhancements

- Playlist management
- User authentication
- Database-backed liked songs
- Music queue
- Shuffle mode
- Repeat mode
- AI song recommendations
- Listening history
- User profiles

---

## Demo

Spotify-style music player powered by:

- React
- Spring Boot
- PostgreSQL
- YouTube Data API v3
- YouTube IFrame API

---

## Author

**Madan Kumar A**

B.E. Computer Science and Engineering

JJ College of Engineering and Technology
