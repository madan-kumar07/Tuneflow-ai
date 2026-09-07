import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import LikedSongs from "./pages/LikedSongs";
import Playlist from "./pages/Playlist";

import ProtectedRoute from "./components/ProtectedRoute";
import MusicPlayer from "./components/MusicPlayer";

import { PlayerProvider, usePlayer } from "./context/PlayerContext";

import "./App.css";

/* ================================
   GLOBAL MUSIC PLAYER
================================ */

const GlobalPlayer = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    setVolume,
    nextSong,
    previousSong,
    togglePlayPause,
    currentTime,
    duration,
    seekTo,
  } = usePlayer();

  if (!currentSong) {
    return null;
  }

  const formatTime = (time) => {
    if (!time || Number.isNaN(Number(time))) {
      return "0:00";
    }

    const totalSeconds = Math.floor(Number(time));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <MusicPlayer
      song={currentSong}
      isPlaying={isPlaying}
      togglePlayPause={togglePlayPause}
      volume={volume}
      setVolume={setVolume}
      nextSong={nextSong}
      previousSong={previousSong}
      currentTime={currentTime}
      duration={duration}
      formatTime={formatTime}
      seekTo={seekTo}
    />
  );
};

/* ================================
   APP
================================ */

function App() {
  return (
    <PlayerProvider>
      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/liked-songs"
          element={
            <ProtectedRoute>
              <LikedSongs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Playlist />
            </ProtectedRoute>
          }
        />

        {/* Individual playlist */}
        <Route
          path="/playlists/:playlistId"
          element={
            <ProtectedRoute>
              <Playlist />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ONE GLOBAL PLAYER FOR THE ENTIRE APP */}
      <GlobalPlayer />
    </PlayerProvider>
  );
}

export default App;