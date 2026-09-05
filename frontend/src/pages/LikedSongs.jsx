import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaPlay,
  FaPause,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

import { usePlayer } from "../context/PlayerContext";

import "./LikedSongs.css";

const API_BASE_URL =
  "http://localhost:8080";

const LIKED_SONGS_URL =
  `${API_BASE_URL}/api/songs/liked`;

const LikedSongs = () => {
  const navigate = useNavigate();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
  } = usePlayer();

  const [likedSongs, setLikedSongs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ==============================
     JWT
  ============================== */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getAuthHeaders = () => {
    const token = getToken();

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  /* ==============================
     LOAD LIKED SONGS
  ============================== */

  const loadLikedSongs = async () => {
    const token = getToken();

    if (!token) {
      setLikedSongs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        LIKED_SONGS_URL,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log(
        "Liked songs:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setLikedSongs(response.data);
      } else {
        setLikedSongs([]);
      }
    } catch (error) {
      console.error(
        "Failed to load liked songs:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert(
          "Session expired. Please login again."
        );
      }

      setLikedSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLikedSongs();
  }, []);

  /* ==============================
     NORMALIZE
  ============================== */

  const normalizeSong = (song) => {
    return {
      ...song,

      videoId:
        song.videoId ||
        song.youtubeVideoId ||
        song.youtubeId ||
        "",

      thumbnail:
        song.thumbnail ||
        song.imageUrl ||
        "",

      channel:
        song.channel ||
        song.artist ||
        "Unknown Artist",

      title:
        song.title ||
        "Unknown Song",
    };
  };

  /* ==============================
     PLAY
  ============================== */

  const handlePlaySong = (
    song,
    index
  ) => {
    const normalized =
      normalizeSong(song);

    if (!normalized.videoId) {
      alert(
        "This song does not have a YouTube video ID."
      );

      return;
    }

    playSong(
      normalized,
      likedSongs.map(normalizeSong),
      index
    );
  };

  /* ==============================
     PLAY ALL
  ============================== */

  const playAll = () => {
    if (!likedSongs.length) {
      return;
    }

    const normalizedSongs =
      likedSongs.map(normalizeSong);

    playSong(
      normalizedSongs[0],
      normalizedSongs,
      0
    );
  };

  /* ==============================
     REMOVE SONG
  ============================== */

  const removeSong = async (song) => {
    if (!song?.id) {
      console.error(
        "Song database ID missing:",
        song
      );

      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/songs/${song.id}/like`,
        {
          headers: getAuthHeaders(),
        }
      );

      setLikedSongs((previous) =>
        previous.filter(
          (item) =>
            Number(item.id) !==
            Number(song.id)
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove liked song:",
        error
      );

      alert(
        "Unable to remove liked song."
      );
    }
  };

  /* ==============================
     CLEAR ALL
  ============================== */

  const clearAll = async () => {
    if (!likedSongs.length) {
      return;
    }

    const confirmed =
      window.confirm(
        "Remove all liked songs?"
      );

    if (!confirmed) {
      return;
    }

    try {
      for (const song of likedSongs) {
        if (!song?.id) continue;

        await axios.delete(
          `${API_BASE_URL}/api/songs/${song.id}/like`,
          {
            headers: getAuthHeaders(),
          }
        );
      }

      setLikedSongs([]);
    } catch (error) {
      console.error(
        "Failed to clear liked songs:",
        error
      );

      await loadLikedSongs();

      alert(
        "Unable to clear all liked songs."
      );
    }
  };

  /* ==============================
     LOADING
  ============================== */

  if (loading) {
    return (
      <div className="liked-page">
        <div className="liked-loading">
          <div className="loading-spinner"></div>

          <h2>
            Loading your liked songs...
          </h2>
        </div>
      </div>
    );
  }

  /* ==============================
     UI
  ============================== */

  return (
    <div className="liked-page">

      {/* HEADER */}

      <div className="liked-header">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
          title="Back"
        >
          <FaArrowLeft />
        </button>

        <div className="liked-cover">
          <FaHeart />
        </div>

        <div className="liked-info">

          <span className="liked-label">
            PLAYLIST
          </span>

          <h1>
            Liked Songs
          </h1>

          <p>
            {likedSongs.length}{" "}
            {likedSongs.length === 1
              ? "song"
              : "songs"}{" "}
            you love
          </p>

        </div>

      </div>

      {/* ACTIONS */}

      {likedSongs.length > 0 && (
        <div className="liked-actions">

          <button
            className="play-all-btn"
            onClick={playAll}
          >
            <FaPlay />
            Play All
          </button>

          <button
            className="clear-btn"
            onClick={clearAll}
          >
            Clear All
          </button>

        </div>
      )}

      {/* EMPTY */}

      {likedSongs.length === 0 ? (

        <div className="empty-liked">

          <div className="empty-heart">
            <FaHeart />
          </div>

          <h2>
            No liked songs yet
          </h2>

          <p>
            Songs you like will appear here.
            <br />
            Start discovering your next
            favourite track.
          </p>

          <button
            className="discover-btn"
            onClick={() => navigate("/")}
          >
            Discover Music
          </button>

        </div>

      ) : (

        /* SONG LIST */

        <div className="liked-list">

          {likedSongs.map(
            (song, index) => {

              const normalized =
                normalizeSong(song);

              const isCurrent =
                currentSong?.videoId ===
                normalized.videoId;

              return (
                <div
                  className={`liked-row ${
                    isCurrent
                      ? "playing"
                      : ""
                  }`}
                  key={
                    song.id ||
                    normalized.videoId ||
                    index
                  }
                >

                  {/* NUMBER */}

                  <div className="song-number">

                    {isCurrent &&
                    isPlaying ? (
                      <span className="playing-bars">
                        ♪
                      </span>
                    ) : (
                      index + 1
                    )}

                  </div>

                  {/* IMAGE */}

                  <img
                    className="liked-thumbnail"
                    src={
                      normalized.thumbnail
                    }
                    alt={
                      normalized.title
                    }
                  />

                  {/* INFO */}

                  <div className="liked-song-info">

                    <h3>
                      {normalized.title}
                    </h3>

                    <p>
                      {normalized.channel}
                    </p>

                  </div>

                  {/* PLAY */}

                  <button
                    className="row-play-btn"
                    onClick={() => {

                      if (isCurrent) {
                        togglePlayPause();
                      } else {
                        handlePlaySong(
                          song,
                          index
                        );
                      }

                    }}
                    title={
                      isCurrent &&
                      isPlaying
                        ? "Pause"
                        : "Play"
                    }
                  >

                    {isCurrent &&
                    isPlaying ? (
                      <FaPause />
                    ) : (
                      <FaPlay />
                    )}

                  </button>

                  {/* REMOVE */}

                  <button
                    className="remove-liked-btn"
                    onClick={() =>
                      removeSong(song)
                    }
                    title="Remove from Liked Songs"
                  >
                    <FaTrash />
                  </button>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default LikedSongs;