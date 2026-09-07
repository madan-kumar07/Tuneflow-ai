import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaBell,
  FaCheck,
  FaHeart,
  FaMusic,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import SongList from "../components/SongList";
import MusicPlayer from "../components/MusicPlayer";
import YouTubePlayer from "../components/YouTubePlayer";

import "./Home.css";

const API_BASE_URL = "http://localhost:8080";

const YOUTUBE_SEARCH_URL =
  `${API_BASE_URL}/api/youtube/search`;

const SONGS_URL =
  `${API_BASE_URL}/api/songs`;

const LIKED_SONGS_URL =
  `${API_BASE_URL}/api/songs/liked`;

const PLAYLISTS_URL =
  `${API_BASE_URL}/api/playlists`;


/* =========================================================
   HELPERS
========================================================= */

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const normalizeSong = (song) => {
  if (!song) return null;

  return {
    ...song,

    videoId:
      song.videoId ||
      song.youtubeVideoId ||
      song.youtubeId ||
      "",

    title:
      song.title ||
      "Unknown Song",

    thumbnail:
      song.thumbnail ||
      song.imageUrl ||
      "",

    channel:
      song.channel ||
      song.artist ||
      "Unknown Artist",

    artist:
      song.artist ||
      song.channel ||
      "Unknown Artist",
  };
};


/* =========================================================
   HOME
========================================================= */

function Home() {

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");


  /* -------------------------------------------------------
     RECENT
  ------------------------------------------------------- */

  const [recentSongs, setRecentSongs] = useState([]);


  /* -------------------------------------------------------
     LIKES
  ------------------------------------------------------- */

  const [likedSongs, setLikedSongs] = useState([]);
  const [likeLoading, setLikeLoading] = useState(false);


  /* -------------------------------------------------------
     PLAYLISTS
  ------------------------------------------------------- */

  const [playlists, setPlaylists] = useState([]);
  const [playlistLoading, setPlaylistLoading] =
    useState(false);

  const [playlistActionLoading, setPlaylistActionLoading] =
    useState(false);

  const [showPlaylistModal, setShowPlaylistModal] =
    useState(false);

  const [selectedSong, setSelectedSong] =
    useState(null);

  const [showCreatePlaylist, setShowCreatePlaylist] =
    useState(false);

  const [newPlaylistName, setNewPlaylistName] =
    useState("");

  const [newPlaylistDescription, setNewPlaylistDescription] =
    useState("");


  /* -------------------------------------------------------
     PLAYER
  ------------------------------------------------------- */

  const [currentSong, setCurrentSong] =
    useState(null);

  const [queue, setQueue] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [volume, setVolume] =
    useState(1);

  const [player, setPlayer] =
    useState(null);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const progressIntervalRef =
    useRef(null);


  /* =========================================================
     LOAD RECENT SONGS
  ========================================================= */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("recentSongs");

      if (!stored) return;

      const parsed =
        JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setRecentSongs(
          parsed
            .map(normalizeSong)
            .filter((song) => song?.videoId)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load recent songs:",
        error
      );
    }
  }, []);


  /* =========================================================
     LOAD LIKED SONGS
  ========================================================= */

  const loadLikedSongs = async () => {
    const token = getToken();

    if (!token) {
      setLikedSongs([]);
      return;
    }

    try {
      const response =
        await axios.get(
          LIKED_SONGS_URL,
          {
            headers: getHeaders(),
          }
        );

      if (Array.isArray(response.data)) {
        setLikedSongs(
          response.data
            .map(normalizeSong)
            .filter(Boolean)
        );
      } else {
        setLikedSongs([]);
      }

    } catch (error) {
      console.error(
        "Failed to load liked songs:",
        error
      );

      setLikedSongs([]);
    }
  };


  /* =========================================================
     LOAD PLAYLISTS
  ========================================================= */

  const loadPlaylists = async () => {
    const token = getToken();

    if (!token) {
      setPlaylists([]);
      return;
    }

    try {
      setPlaylistLoading(true);

      const response =
        await axios.get(
          PLAYLISTS_URL,
          {
            headers: getHeaders(),
          }
        );

      if (Array.isArray(response.data)) {
        setPlaylists(response.data);
      } else {
        setPlaylists([]);
      }

    } catch (error) {
      console.error(
        "Failed to load playlists:",
        error
      );

      setPlaylists([]);
    } finally {
      setPlaylistLoading(false);
    }
  };


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadLikedSongs();
    loadPlaylists();
  }, []);


  /* =========================================================
     SEARCH
  ========================================================= */

  const searchSongs = async () => {

    const value =
      query.trim();

    if (!value) {
      setSongs([]);
      setSearchError("");
      return;
    }

    try {
      setLoading(true);
      setSearchError("");

      const response =
        await axios.get(
          YOUTUBE_SEARCH_URL,
          {
            params: {
              query: value,
            },
            headers: getHeaders(),
          }
        );

      if (Array.isArray(response.data)) {

        const normalized =
          response.data
            .map(normalizeSong)
            .filter(
              (song) =>
                song?.videoId
            );

        setSongs(normalized);

        if (!normalized.length) {
          setSearchError(
            "No songs found."
          );
        }

      } else {
        setSongs([]);
        setSearchError(
          "No songs found."
        );
      }

    } catch (error) {

      console.error(
        "Search failed:",
        error
      );

      setSongs([]);

      if (
        error.response?.status === 403
      ) {
        setSearchError(
          "YouTube request was rejected."
        );
      } else if (
        error.response?.status === 500
      ) {
        setSearchError(
          "Music service is currently unavailable."
        );
      } else {
        setSearchError(
          "Unable to search songs."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     SEARCH ENTER
  ========================================================= */

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      searchSongs();
    }
  };


  /* =========================================================
     SAVE RECENT
  ========================================================= */

  const saveRecentSong = (song) => {

    const normalized =
      normalizeSong(song);

    if (!normalized?.videoId) {
      return;
    }

    const updated = [
      normalized,

      ...recentSongs.filter(
        (item) =>
          item.videoId !==
          normalized.videoId
      ),
    ].slice(0, 10);

    setRecentSongs(updated);

    localStorage.setItem(
      "recentSongs",
      JSON.stringify(updated)
    );
  };


  /* =========================================================
     PLAY SONG
  ========================================================= */

  const handlePlaySong = (
    song,
    customQueue = null,
    customIndex = null
  ) => {

    const normalized =
      normalizeSong(song);

    if (!normalized?.videoId) {
      return;
    }

    const activeQueue =
      Array.isArray(customQueue) &&
      customQueue.length
        ? customQueue
            .map(normalizeSong)
            .filter(Boolean)
        : songs;

    let index =
      customIndex;

    if (
      index === null ||
      index === undefined
    ) {
      index =
        activeQueue.findIndex(
          (item) =>
            item.videoId ===
            normalized.videoId
        );
    }

    setQueue(activeQueue);
    setCurrentIndex(index);
    setCurrentSong(normalized);

    setCurrentTime(0);
    setDuration(0);

    setIsPlaying(true);

    saveRecentSong(normalized);
  };


  /* =========================================================
     LIKE CHECK
  ========================================================= */

  const isSongLiked = (song) => {

    if (!song) return false;

    return likedSongs.some(
      (liked) => {

        if (
          liked.videoId &&
          song.videoId
        ) {
          return (
            liked.videoId ===
            song.videoId
          );
        }

        if (
          liked.id &&
          song.id
        ) {
          return (
            Number(liked.id) ===
            Number(song.id)
          );
        }

        return false;
      }
    );
  };


  /* =========================================================
     FIND DATABASE SONG
  ========================================================= */

  const findDatabaseSong =
    async (song) => {

      if (!song) return null;

      if (song.id) {
        return song;
      }

      try {

        const response =
          await axios.get(
            SONGS_URL,
            {
              headers:
                getHeaders(),
            }
          );

        if (
          !Array.isArray(
            response.data
          )
        ) {
          return null;
        }

        return (
          response.data.find(
            (item) =>
              item.videoId ===
              song.videoId
          ) || null
        );

      } catch (error) {

        console.error(
          "Database song lookup failed:",
          error
        );

        return null;
      }
    };


  /* =========================================================
     CREATE DATABASE SONG
  ========================================================= */

  const getOrCreateDatabaseSong =
    async (song) => {

      if (!song) return null;

      if (song.id) {
        return song;
      }

      const existing =
        await findDatabaseSong(song);

      if (existing) {
        return existing;
      }

      try {

        const response =
          await axios.post(
            SONGS_URL,
            {
              title:
                song.title ||
                "Unknown Song",

              artist:
                song.channel ||
                song.artist ||
                "Unknown Artist",

              album: "",

              genre: "YouTube",

              duration: 0,

              imageUrl:
                song.thumbnail ||
                song.imageUrl ||
                "",

              audioUrl: "",

              videoId:
                song.videoId ||
                "",
            },
            {
              headers: {
                ...getHeaders(),

                "Content-Type":
                  "application/json",
              },
            }
          );

        return response.data;

      } catch (error) {

        console.error(
          "Song creation failed:",
          error
        );

        return await findDatabaseSong(
          song
        );
      }
    };


  /* =========================================================
     TOGGLE LIKE
  ========================================================= */

  const toggleLike = async (song) => {

    if (likeLoading) {
      return;
    }

    const token = getToken();

    if (!token) {
      alert(
        "Please login to like songs."
      );
      return;
    }

    try {

      setLikeLoading(true);

      const databaseSong =
        await getOrCreateDatabaseSong(
          song
        );

      if (!databaseSong?.id) {
        throw new Error(
          "Song ID unavailable."
        );
      }

      const liked =
        isSongLiked(song);

      if (liked) {

        await axios.delete(
          `${SONGS_URL}/${databaseSong.id}/like`,
          {
            headers:
              getHeaders(),
          }
        );

      } else {

        await axios.post(
          `${SONGS_URL}/${databaseSong.id}/like`,
          {},
          {
            headers:
              getHeaders(),
          }
        );
      }

      await loadLikedSongs();

    } catch (error) {

      console.error(
        "Like operation failed:",
        error
      );

      if (
        error.response?.status ===
          401 ||
        error.response?.status ===
          403
      ) {
        alert(
          "Session expired. Please login again."
        );
      } else {
        alert(
          "Unable to update liked song."
        );
      }

    } finally {
      setLikeLoading(false);
    }
  };


  /* =========================================================
     OPEN PLAYLIST MODAL
  ========================================================= */

  const openPlaylistModal =
    async (song) => {

      if (!getToken()) {
        alert(
          "Please login to use playlists."
        );
        return;
      }

      const normalized =
        normalizeSong(song);

      if (!normalized?.videoId) {
        return;
      }

      setSelectedSong(normalized);

      setShowCreatePlaylist(false);

      setNewPlaylistName("");
      setNewPlaylistDescription("");

      setShowPlaylistModal(true);

      await loadPlaylists();
    };


  /* =========================================================
     CLOSE PLAYLIST MODAL
  ========================================================= */

  const closePlaylistModal = () => {

    if (playlistActionLoading) {
      return;
    }

    setShowPlaylistModal(false);
    setSelectedSong(null);

    setShowCreatePlaylist(false);

    setNewPlaylistName("");
    setNewPlaylistDescription("");
  };


  /* =========================================================
     ADD SONG TO PLAYLIST
  ========================================================= */

  const addSongToPlaylist =
    async (playlist) => {

      if (
        !selectedSong ||
        !playlist?.id
      ) {
        return;
      }

      if (playlistActionLoading) {
        return;
      }

      try {

        setPlaylistActionLoading(true);

        const databaseSong =
          await getOrCreateDatabaseSong(
            selectedSong
          );

        if (!databaseSong?.id) {
          throw new Error(
            "Database song unavailable."
          );
        }

        await axios.post(
          `${PLAYLISTS_URL}/${playlist.id}/songs/${databaseSong.id}`,
          {},
          {
            headers:
              getHeaders(),
          }
        );

        setPlaylists(
          (previous) =>
            previous.map(
              (item) =>
                item.id === playlist.id
                  ? {
                      ...item,
                      songCount:
                        Number(
                          item.songCount ||
                          0
                        ) + 1,
                    }
                  : item
            )
        );

        closePlaylistModal();

      } catch (error) {

        console.error(
          "Playlist add failed:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "";

        if (
          message
            .toLowerCase()
            .includes("already")
        ) {
          alert(
            "This song is already in the playlist."
          );
        } else if (
          error.response?.status ===
            401 ||
          error.response?.status ===
            403
        ) {
          alert(
            "Session expired. Please login again."
          );
        } else {
          alert(
            "Unable to add this song to the playlist."
          );
        }

      } finally {
        setPlaylistActionLoading(false);
      }
    };


  /* =========================================================
     CREATE PLAYLIST
  ========================================================= */

  const createPlaylist =
    async () => {

      const name =
        newPlaylistName.trim();

      const description =
        newPlaylistDescription.trim();

      if (!name) {
        alert(
          "Enter a playlist name."
        );
        return;
      }

      if (playlistActionLoading) {
        return;
      }

      try {

        setPlaylistActionLoading(true);

        const response =
          await axios.post(
            PLAYLISTS_URL,
            {
              name,
              description,
            },
            {
              headers: {
                ...getHeaders(),

                "Content-Type":
                  "application/json",
              },
            }
          );

        const created =
          response.data;

        setPlaylists(
          (previous) => [
            created,
            ...previous,
          ]
        );

        /*
         * If song is selected,
         * automatically add it.
         */

        if (
          selectedSong &&
          created?.id
        ) {

          const databaseSong =
            await getOrCreateDatabaseSong(
              selectedSong
            );

          if (databaseSong?.id) {

            await axios.post(
              `${PLAYLISTS_URL}/${created.id}/songs/${databaseSong.id}`,
              {},
              {
                headers:
                  getHeaders(),
              }
            );
          }
        }

        setNewPlaylistName("");
        setNewPlaylistDescription("");

        closePlaylistModal();

      } catch (error) {

        console.error(
          "Create playlist failed:",
          error
        );

        alert(
          "Unable to create playlist."
        );

      } finally {
        setPlaylistActionLoading(false);
      }
    };


  /* =========================================================
     NEXT SONG
  ========================================================= */

  const nextSong = () => {

    if (!queue.length) {
      return;
    }

    if (
      currentIndex >= 0 &&
      currentIndex <
        queue.length - 1
    ) {

      const nextIndex =
        currentIndex + 1;

      handlePlaySong(
        queue[nextIndex],
        queue,
        nextIndex
      );
    }
  };


  /* =========================================================
     PREVIOUS SONG
  ========================================================= */

  const previousSong = () => {

    if (!queue.length) {
      return;
    }

    if (currentIndex > 0) {

      const previousIndex =
        currentIndex - 1;

      handlePlaySong(
        queue[previousIndex],
        queue,
        previousIndex
      );
    }
  };


  /* =========================================================
     PLAYER READY
  ========================================================= */

  const handlePlayerReady =
    (youtubePlayer) => {

      setPlayer(youtubePlayer);

      try {

        youtubePlayer.setVolume(
          Number(volume) * 100
        );

        if (isPlaying) {
          youtubePlayer.playVideo();
        }

      } catch (error) {
        console.error(
          "Player ready error:",
          error
        );
      }
    };


  /* =========================================================
     PLAYER PROGRESS
  ========================================================= */

  useEffect(() => {

    if (
      !player ||
      !currentSong
    ) {
      return;
    }

    if (
      progressIntervalRef.current
    ) {
      clearInterval(
        progressIntervalRef.current
      );
    }

    progressIntervalRef.current =
      setInterval(() => {

        try {

          setCurrentTime(
            player.getCurrentTime() ||
              0
          );

          setDuration(
            player.getDuration() ||
              0
          );

        } catch {
          // player not ready
        }

      }, 250);

    return () => {

      if (
        progressIntervalRef.current
      ) {
        clearInterval(
          progressIntervalRef.current
        );

        progressIntervalRef.current =
          null;
      }
    };

  }, [player, currentSong]);


  /* =========================================================
     VOLUME
  ========================================================= */

  useEffect(() => {

    if (!player) return;

    try {

      player.setVolume(
        Number(volume) * 100
      );

    } catch {
      // ignore
    }

  }, [volume, player]);


  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  const togglePlayPause = () => {

    if (!player) return;

    try {

      if (isPlaying) {

        player.pauseVideo();
        setIsPlaying(false);

      } else {

        player.playVideo();
        setIsPlaying(true);
      }

    } catch (error) {

      console.error(
        "Play pause error:",
        error
      );
    }
  };


  /* =========================================================
     SEEK
  ========================================================= */

  const seekTo = (time) => {

    if (!player) return;

    const value =
      Number(time);

    if (Number.isNaN(value)) {
      return;
    }

    try {

      player.seekTo(
        value,
        true
      );

      setCurrentTime(value);

    } catch {
      // ignore
    }
  };


  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (time) => {

    const seconds =
      Math.floor(
        Number(time) || 0
      );

    const minutes =
      Math.floor(
        seconds / 60
      );

    const remaining =
      seconds % 60;

    return (
      `${minutes}:${String(
        remaining
      ).padStart(2, "0")}`
    );
  };


  /* =========================================================
     GREETING
  ========================================================= */

  const getGreeting = () => {

    const hour =
      new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="home-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

     <Sidebar
  onCreatePlaylist={() => {
    setSelectedSong(null);
    setShowCreatePlaylist(true);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setShowPlaylistModal(true);
  }}
/>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="home-content">

        {/* TOP BAR */}

        <header className="home-topbar">

          <div className="home-greeting">

            <span className="home-greeting-small">
              WELCOME BACK
            </span>

            <h1>
              {getGreeting()} 👋
            </h1>

            <p>
              Your music. Your mood. Your moment.
            </p>

          </div>

          <div className="home-top-actions">

            <button
              className="top-icon-button"
              title="Notifications"
            >
              <FaBell />
            </button>

            <div className="user-chip">
              <div className="user-avatar">
                <FaMusic />
              </div>

              <div>
                <strong>
                  TuneFlow User
                </strong>

                <span>
                  Music lover
                </span>
              </div>
            </div>

          </div>

        </header>


        {/* ===================================================
            HERO
        =================================================== */}

        {!query.trim() && (
          <section className="premium-hero">

            <div className="hero-content">

              <span className="hero-badge">
                <FaMusic />
                TUNEFLOW AI
              </span>

              <h2>
                Discover music
                <br />
                <span>that feels like you.</span>
              </h2>

              <p>
                Search millions of songs,
                build playlists and keep
                your favourites together.
              </p>

              <div className="hero-actions">

                <button
                  className="hero-primary"
                  onClick={() => {
                    document
                      .querySelector(
                        ".premium-search-input"
                      )
                      ?.focus();
                  }}
                >
                  <FaSearch />
                  Start exploring
                </button>

                <button
                  className="hero-secondary"
                  onClick={() => {
                    document
                      .querySelector(
                        ".premium-search-input"
                      )
                      ?.focus();
                  }}
                >
                  Search music
                </button>

              </div>

            </div>


            <div className="hero-visual">

              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />

              <div className="hero-album">

                <div className="album-disc">
                  <div className="album-center">
                    ♪
                  </div>
                </div>

                <div className="album-lines">
                  <span />
                  <span />
                  <span />
                </div>

              </div>

            </div>

          </section>
        )}


        {/* ===================================================
            SEARCH
        =================================================== */}

        <section className="premium-search">

          <div className="search-wrapper">

            <FaSearch className="search-icon" />

            <input
              className="premium-search-input"
              type="text"
              placeholder="Search songs, artists, albums..."
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={
                handleSearchKeyDown
              }
            />

            {query && (
              <button
                className="clear-search"
                onClick={() => {
                  setQuery("");
                  setSongs([]);
                  setSearchError("");
                }}
              >
                <FaTimes />
              </button>
            )}

            <button
              className="search-submit"
              onClick={searchSongs}
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search"}
            </button>

          </div>

        </section>


        {/* ===================================================
            ERROR
        =================================================== */}

        {searchError && (
          <div className="home-error">
            {searchError}
          </div>
        )}


        {/* ===================================================
            SEARCH RESULTS
        =================================================== */}

        {loading ? (

          <section className="home-loading">

            <div className="loading-ring" />

            <h3>
              Finding your music...
            </h3>

            <p>
              Searching TuneFlow
            </p>

          </section>

        ) : (

          <>
            {songs.length > 0 && (

              <section className="home-section">

                <div className="section-header">

                  <div>
                    <span>
                      SEARCH
                    </span>

                    <h2>
                      Search results
                    </h2>
                  </div>

                  <small>
                    {songs.length} tracks
                  </small>

                </div>

                <SongList
                  songs={songs}
                  playSong={handlePlaySong}
                  toggleLike={toggleLike}
                  likedSongs={likedSongs}
                  onAddToPlaylist={
                    openPlaylistModal
                  }
                />

              </section>
            )}


            {/* =================================================
                RECENT
            ================================================= */}

            {!query.trim() &&
              recentSongs.length > 0 && (

                <section className="home-section">

                  <div className="section-header">

                    <div>
                      <span>
                        YOUR HISTORY
                      </span>

                      <h2>
                        Recently played
                      </h2>
                    </div>

                    <small>
                      {recentSongs.length} tracks
                    </small>

                  </div>

                  <SongList
                    songs={recentSongs}
                    playSong={handlePlaySong}
                    toggleLike={toggleLike}
                    likedSongs={likedSongs}
                    onAddToPlaylist={
                      openPlaylistModal
                    }
                  />

                </section>
              )}


            {/* =================================================
                EMPTY / DISCOVER
            ================================================= */}

            {!query.trim() &&
              recentSongs.length === 0 && (

                <section className="discover-section">

                  <div className="discover-card">

                    <div className="discover-icon">
                      <FaSearch />
                    </div>

                    <div>
                      <span>
                        DISCOVER
                      </span>

                      <h3>
                        Find your next favourite
                      </h3>

                      <p>
                        Search for songs,
                        artists or albums
                        and start listening.
                      </p>
                    </div>

                  </div>


                  <div className="discover-card">

                    <div className="discover-icon">
                      <FaPlus />
                    </div>

                    <div>
                      <span>
                        YOUR COLLECTION
                      </span>

                      <h3>
                        Build a playlist
                      </h3>

                      <p>
                        Add songs to your
                        personal playlists
                        while you listen.
                      </p>
                    </div>

                  </div>

                </section>
              )}

          </>
        )}

      </main>


      {/* =====================================================
          PLAYLIST MODAL
      ===================================================== */}

      {showPlaylistModal && (

        <div
          className="playlist-overlay"
          onClick={closePlaylistModal}
        >

          <div
            className="playlist-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="playlist-modal-top">

              <div>

                <span>
                  {selectedSong ? "SAVE TO PLAYLIST" : "YOUR LIBRARY"}
                </span>

                <h2>
                  {selectedSong
                    ? "Add to playlist"
                    : "Create a playlist"}
                </h2>

                {selectedSong && (
                  <p>
                    {selectedSong.title}
                  </p>
                )}

              </div>

              <button
                className="modal-close"
                onClick={closePlaylistModal}
                disabled={
                  playlistActionLoading
                }
              >
                <FaTimes />
              </button>

            </div>


            {/* CREATE */}

            {!showCreatePlaylist ? (

              <button
                className="create-playlist-row"
                onClick={() =>
                  setShowCreatePlaylist(true)
                }
              >

                <div className="create-icon">
                  <FaPlus />
                </div>

                <div>
                  <strong>
                    Create new playlist
                  </strong>

                  <span>
                    Create a playlist and add
                    this song
                  </span>
                </div>

              </button>

            ) : (

              <div className="create-playlist-form">

                <input
                  type="text"
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(event) =>
                    setNewPlaylistName(
                      event.target.value
                    )
                  }
                  autoFocus
                />

                <textarea
                  placeholder="Description (optional)"
                  value={newPlaylistDescription}
                  onChange={(event) =>
                    setNewPlaylistDescription(
                      event.target.value
                    )
                  }
                />

                <div className="create-form-actions">

                  <button
                    className="cancel-create"
                    onClick={() =>
                      setShowCreatePlaylist(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="confirm-create"
                    onClick={createPlaylist}
                    disabled={
                      playlistActionLoading
                    }
                  >
                    <FaCheck />

                    {playlistActionLoading
                      ? "Creating..."
                      : "Create playlist"}
                  </button>

                </div>

              </div>
            )}


            {/* PLAYLIST LIST */}

            <div className="playlist-list">

              <div className="playlist-list-title">
                YOUR PLAYLISTS
              </div>

              {playlistLoading ? (

                <div className="playlist-loading">
                  Loading playlists...
                </div>

              ) : playlists.length === 0 ? (

                <div className="playlist-empty">

                  <FaMusic />

                  <strong>
                    No playlists yet
                  </strong>

                  <span>
                    Create your first playlist
                    above.
                  </span>

                </div>

              ) : (

                playlists.map(
                  (playlist) => (

                    <button
                      key={playlist.id}
                      className="playlist-item"
                      onClick={() =>
                        addSongToPlaylist(
                          playlist
                        )
                      }
                      disabled={
                        playlistActionLoading
                      }
                    >

                      <div className="playlist-cover">
                        <FaMusic />
                      </div>

                      <div className="playlist-info">

                        <strong>
                          {playlist.name}
                        </strong>

                        <span>
                          {Number(
                            playlist.songCount ||
                            0
                          )}{" "}
                          {Number(
                            playlist.songCount ||
                            0
                          ) === 1
                            ? "song"
                            : "songs"}
                        </span>

                      </div>

                      <div className="playlist-add-icon">

                        {playlistActionLoading
                          ? "..."
                          : <FaPlus />}

                      </div>

                    </button>
                  )
                )
              )}

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          MUSIC PLAYER
      ===================================================== */}

      <MusicPlayer
        song={currentSong}
        isPlaying={isPlaying}
        togglePlayPause={
          togglePlayPause
        }
        volume={volume}
        setVolume={setVolume}
        nextSong={nextSong}
        previousSong={previousSong}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        seekTo={seekTo}
      />


      {/* =====================================================
          YOUTUBE PLAYER
      ===================================================== */}

      <YouTubePlayer
        videoId={
          currentSong?.videoId
        }
        isPlaying={isPlaying}
        volume={volume}
        onReady={
          handlePlayerReady
        }
        onEnd={() => {
          if (
            currentIndex >= 0 &&
            currentIndex <
              queue.length - 1
          ) {
            nextSong();
          } else {
            setIsPlaying(false);
          }
        }}
        seekTo={seekTo}
      />

    </div>
  );
}

export default Home;