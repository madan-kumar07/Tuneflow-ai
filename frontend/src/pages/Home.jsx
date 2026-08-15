import { useEffect, useRef, useState } from "react";
import axios from "axios";

import YouTubePlayer from "../components/YouTubePlayer";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";
import MusicPlayer from "../components/MusicPlayer";

import "../App.css";

/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

const API_BASE_URL = "http://localhost:8080";

const YOUTUBE_SEARCH_URL = `${API_BASE_URL}/api/youtube/search`;

const SONGS_URL = `${API_BASE_URL}/api/songs`;

const LIKED_SONGS_URL = `${API_BASE_URL}/api/songs/liked`;

/*
|--------------------------------------------------------------------------
| Home Component
|--------------------------------------------------------------------------
*/

function Home() {
  /*
  |--------------------------------------------------------------------------
  | Search State
  |--------------------------------------------------------------------------
  */

  const [query, setQuery] = useState("");

  const [songs, setSongs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchError, setSearchError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Current Song / Player State
  |--------------------------------------------------------------------------
  */

  const [currentSong, setCurrentSong] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(1);

  const [player, setPlayer] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | User Music Data
  |--------------------------------------------------------------------------
  */

  const [likedSongs, setLikedSongs] = useState([]);

  const [recentSongs, setRecentSongs] = useState([]);

  const [likedLoading, setLikedLoading] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Player Reference
  |--------------------------------------------------------------------------
  */

  const progressIntervalRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Get JWT Token
  |--------------------------------------------------------------------------
  */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /*
  |--------------------------------------------------------------------------
  | Authorization Headers
  |--------------------------------------------------------------------------
  */

  const getAuthHeaders = () => {
    const token = getToken();

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Load Recently Played Songs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const storedRecentSongs =
        localStorage.getItem("recentSongs");

      if (!storedRecentSongs) {
        setRecentSongs([]);
        return;
      }

      const parsedRecentSongs =
        JSON.parse(storedRecentSongs);

      if (Array.isArray(parsedRecentSongs)) {
        setRecentSongs(parsedRecentSongs);
      } else {
        setRecentSongs([]);
      }
    } catch (error) {
      console.error(
        "Failed to load recent songs:",
        error
      );

      setRecentSongs([]);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Liked Songs From Database
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | We intentionally DO NOT read likedSongs from localStorage.
  |
  | Backend decides which songs belong to the logged-in user.
  |
  */

  useEffect(() => {
    loadLikedSongs();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Liked Songs
  |--------------------------------------------------------------------------
  */

  const loadLikedSongs = async () => {
    const token = getToken();

    if (!token) {
      console.warn(
        "No JWT token found. Cannot load liked songs."
      );

      setLikedSongs([]);

      return;
    }

    try {
      setLikedLoading(true);

      const response = await axios.get(
        LIKED_SONGS_URL,
        {
          headers: getAuthHeaders(),
        }
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

      /*
      |--------------------------------------------------------------------------
      | Token Expired / Unauthorized
      |--------------------------------------------------------------------------
      */

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        console.warn(
          "JWT expired or unauthorized."
        );
      }

      setLikedSongs([]);
    } finally {
      setLikedLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search YouTube Songs
  |--------------------------------------------------------------------------
  */

  const searchSongs = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSongs([]);
      return;
    }

    try {
      setLoading(true);

      setSearchError("");

      const response = await axios.get(
        YOUTUBE_SEARCH_URL,
        {
          params: {
            query: trimmedQuery,
          },

          headers: getAuthHeaders(),
        }
      );

      if (Array.isArray(response.data)) {
        setSongs(response.data);
      } else {
        setSongs([]);

        setSearchError(
          "No songs found."
        );
      }
    } catch (error) {
      console.error(
        "YouTube search failed:",
        error
      );

      setSongs([]);

      if (error.response?.status === 403) {
        setSearchError(
          "YouTube API request was rejected."
        );
      } else if (error.response?.status === 500) {
        setSearchError(
          "Music service is currently unavailable."
        );
      } else {
        setSearchError(
          "Unable to search songs. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search On Enter
  |--------------------------------------------------------------------------
  */

  const handleSearch = async () => {
    await searchSongs();
  };

  /*
  |--------------------------------------------------------------------------
  | Save Recent Song
  |--------------------------------------------------------------------------
  */

  const saveRecentSong = (song) => {
    if (!song) {
      return;
    }

    const updatedRecentSongs = [
      song,

      ...recentSongs.filter(
        (item) =>
          item.videoId !== song.videoId
      ),
    ];

    const limitedRecentSongs =
      updatedRecentSongs.slice(0, 10);

    setRecentSongs(limitedRecentSongs);

    localStorage.setItem(
      "recentSongs",
      JSON.stringify(limitedRecentSongs)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Play Song
  |--------------------------------------------------------------------------
  */

  const playSong = (song, index = null) => {
    if (!song) {
      return;
    }

    let songIndex = index;

    /*
    |--------------------------------------------------------------------------
    | Find Song Index
    |--------------------------------------------------------------------------
    */

    if (songIndex === null) {
      songIndex = songs.findIndex(
        (item) =>
          item.videoId === song.videoId
      );
    }

    setCurrentIndex(songIndex);

    setCurrentTime(0);

    setDuration(0);

    setCurrentSong(song);

    setIsPlaying(true);

    saveRecentSong(song);
  };

  /*
  |--------------------------------------------------------------------------
  | Check Whether Song Is Already Liked
  |--------------------------------------------------------------------------
  */

  const isSongLiked = (song) => {
    if (!song) {
      return false;
    }

    return likedSongs.some((likedSong) => {
      /*
      |--------------------------------------------------------------------------
      | Preferred matching method
      |--------------------------------------------------------------------------
      */

      if (
        song.videoId &&
        likedSong.videoId
      ) {
        return (
          song.videoId ===
          likedSong.videoId
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Fallback to Database ID
      |--------------------------------------------------------------------------
      */

      if (
        song.id &&
        likedSong.id
      ) {
        return (
          Number(song.id) ===
          Number(likedSong.id)
        );
      }

      return false;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Find Database Song By Video ID
  |--------------------------------------------------------------------------
  */

  const findDatabaseSong = async (song) => {
    if (!song) {
      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | If YouTube result already contains DB ID,
    | use it directly.
    |--------------------------------------------------------------------------
    */

    if (song.id) {
      return song;
    }

    try {
      const response = await axios.get(
        SONGS_URL,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!Array.isArray(response.data)) {
        return null;
      }

      const foundSong =
        response.data.find(
          (databaseSong) =>
            databaseSong.videoId ===
            song.videoId
        );

      return foundSong || null;
    } catch (error) {
      console.error(
        "Failed to find database song:",
        error
      );

      return null;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Song In Database
  |--------------------------------------------------------------------------
  |
  | YouTube search results are external songs.
  |
  | Our liked_songs table needs a song_id.
  |
  | Therefore, if the YouTube result is not yet
  | present in our songs table, create it first.
  |
  */

  const createDatabaseSong = async (song) => {
    if (!song) {
      return null;
    }

    try {
      const requestBody = {
        title: song.title || "Unknown Title",

        artist:
          song.channel ||
          "Unknown Artist",

        album: "",

        genre: "YouTube",

        duration: 0,

        imageUrl:
          song.thumbnail || "",

        audioUrl: "",

        videoId:
          song.videoId || "",
      };

      const response = await axios.post(
        SONGS_URL,
        requestBody,
        {
          headers: {
            ...getAuthHeaders(),

            "Content-Type":
              "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to create database song:",
        error
      );

      /*
      |--------------------------------------------------------------------------
      | If duplicate / already exists,
      | try fetching it again.
      |--------------------------------------------------------------------------
      */

      return await findDatabaseSong(song);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Or Create Database Song
  |--------------------------------------------------------------------------
  */

  const getOrCreateDatabaseSong = async (
    song
  ) => {
    /*
    |--------------------------------------------------------------------------
    | Already has ID
    |--------------------------------------------------------------------------
    */

    if (song?.id) {
      return song;
    }

    /*
    |--------------------------------------------------------------------------
    | Search existing database song
    |--------------------------------------------------------------------------
    */

    const existingSong =
      await findDatabaseSong(song);

    if (existingSong) {
      return existingSong;
    }

    /*
    |--------------------------------------------------------------------------
    | Create new database song
    |--------------------------------------------------------------------------
    */

    return await createDatabaseSong(song);
  };

  /*
  |--------------------------------------------------------------------------
  | Like Song
  |--------------------------------------------------------------------------
  */

  const likeSong = async (song) => {
    if (!song) {
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

      /*
      |--------------------------------------------------------------------------
      | Find / create song in database
      |--------------------------------------------------------------------------
      */

      const databaseSong =
        await getOrCreateDatabaseSong(
          song
        );

      if (!databaseSong?.id) {
        throw new Error(
          "Song ID was not available."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | POST /api/songs/{id}/like
      |--------------------------------------------------------------------------
      */

      await axios.post(
        `${SONGS_URL}/${databaseSong.id}/like`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Refresh liked songs from database
      |--------------------------------------------------------------------------
      */

      await loadLikedSongs();
    } catch (error) {
      console.error(
        "Failed to like song:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert(
          "Your session has expired. Please login again."
        );
      } else {
        alert(
          "Unable to like this song."
        );
      }
    } finally {
      setLikeLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Unlike Song
  |--------------------------------------------------------------------------
  */

  const unlikeSong = async (song) => {
    if (!song) {
      return;
    }

    const token = getToken();

    if (!token) {
      alert(
        "Please login to continue."
      );

      return;
    }

    try {
      setLikeLoading(true);

      /*
      |--------------------------------------------------------------------------
      | Need database ID for DELETE request
      |--------------------------------------------------------------------------
      */

      const databaseSong =
        await getOrCreateDatabaseSong(
          song
        );

      if (!databaseSong?.id) {
        throw new Error(
          "Song ID was not available."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | DELETE /api/songs/{id}/like
      |--------------------------------------------------------------------------
      */

      await axios.delete(
        `${SONGS_URL}/${databaseSong.id}/like`,
        {
          headers: getAuthHeaders(),
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Refresh DB likes
      |--------------------------------------------------------------------------
      */

      await loadLikedSongs();
    } catch (error) {
      console.error(
        "Failed to unlike song:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert(
          "Your session has expired. Please login again."
        );
      } else {
        alert(
          "Unable to unlike this song."
        );
      }
    } finally {
      setLikeLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Like
  |--------------------------------------------------------------------------
  */

  const toggleLike = async (song) => {
    if (likeLoading) {
      return;
    }

    const liked = isSongLiked(song);

    if (liked) {
      await unlikeSong(song);
    } else {
      await likeSong(song);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Next Song
  |--------------------------------------------------------------------------
  */

  const nextSong = () => {
    if (!songs.length) {
      return;
    }

    if (
      currentIndex >= 0 &&
      currentIndex <
        songs.length - 1
    ) {
      const nextIndex =
        currentIndex + 1;

      playSong(
        songs[nextIndex],
        nextIndex
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Previous Song
  |--------------------------------------------------------------------------
  */

  const previousSong = () => {
    if (!songs.length) {
      return;
    }

    if (currentIndex > 0) {
      const previousIndex =
        currentIndex - 1;

      playSong(
        songs[previousIndex],
        previousIndex
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Song End
  |--------------------------------------------------------------------------
  */

  const handleSongEnd = () => {
    if (!songs.length) {
      setIsPlaying(false);

      return;
    }

    if (
      currentIndex >= 0 &&
      currentIndex <
        songs.length - 1
    ) {
      const nextIndex =
        currentIndex + 1;

      playSong(
        songs[nextIndex],
        nextIndex
      );
    } else {
      setIsPlaying(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Player Ready
  |--------------------------------------------------------------------------
  */

  const handlePlayerReady = (
    youtubePlayer
  ) => {
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
        "Player initialization failed:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Player Progress
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!player || !currentSong) {
      return;
    }

    if (progressIntervalRef.current) {
      clearInterval(
        progressIntervalRef.current
      );
    }

    progressIntervalRef.current =
      setInterval(() => {
        try {
          const current =
            player.getCurrentTime() || 0;

          const total =
            player.getDuration() || 0;

          setCurrentTime(current);

          setDuration(total);
        } catch (error) {
          /*
          |--------------------------------------------------------------------------
          | Player may not be ready.
          |--------------------------------------------------------------------------
          */
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

  /*
  |--------------------------------------------------------------------------
  | Volume
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!player) {
      return;
    }

    try {
      player.setVolume(
        Number(volume) * 100
      );
    } catch (error) {
      console.error(
        "Volume update failed:",
        error
      );
    }
  }, [volume, player]);

  /*
  |--------------------------------------------------------------------------
  | Play / Pause
  |--------------------------------------------------------------------------
  */

  const togglePlayPause = () => {
    if (!player) {
      return;
    }

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
        "Play/pause failed:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Seek
  |--------------------------------------------------------------------------
  */

  const seekTo = (time) => {
    if (!player) {
      return;
    }

    const numericTime =
      Number(time);

    if (Number.isNaN(numericTime)) {
      return;
    }

    try {
      player.seekTo(
        numericTime,
        true
      );

      setCurrentTime(
        numericTime
      );
    } catch (error) {
      console.error(
        "Seek failed:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Format Time
  |--------------------------------------------------------------------------
  */

  const formatTime = (time) => {
    if (
      !time ||
      Number.isNaN(Number(time))
    ) {
      return "0:00";
    }

    const totalSeconds =
      Math.floor(Number(time));

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Logout / Account Change Safety
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleStorageChange = (
      event
    ) => {
      if (event.key === "token") {
        loadLikedSongs();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="app">

      {/* ============================================================
          SIDEBAR
          ============================================================ */}

      <Sidebar />

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}

      <div className="main">

        {/* ==========================================================
            NAVBAR
            ========================================================== */}

        <Navbar />

        {/* ==========================================================
            SEARCH BAR
            ========================================================== */}

        <SearchBar
          query={query}
          setQuery={setQuery}
          searchSongs={handleSearch}
        />

        {/* ==========================================================
            SEARCH ERROR
            ========================================================== */}

        {searchError && (
          <div className="error-message">
            {searchError}
          </div>
        )}

        {/* ==========================================================
            LOADING STATE
            ========================================================== */}

        {loading ? (
          <div className="loading">

            <div className="loading-spinner"></div>

            <span className="loading-text">
              Finding your music...
            </span>

          </div>
        ) : (
          <>

            {/* ======================================================
                SEARCH RESULTS
                ====================================================== */}

            {songs.length > 0 && (
              <section>

                <h2 className="section-title">
                  Search Results
                </h2>

                <SongList
                  songs={songs}
                  playSong={playSong}
                  toggleLike={toggleLike}
                  likedSongs={likedSongs}
                />

              </section>
            )}

            {/* ======================================================
                RECENTLY PLAYED
                ====================================================== */}

            {recentSongs.length > 0 && (
              <section>

                <h2 className="section-title">
                  Recently Played
                </h2>

                <SongList
                  songs={recentSongs}
                  playSong={playSong}
                  toggleLike={toggleLike}
                  likedSongs={likedSongs}
                />

              </section>
            )}

            {/* ======================================================
                EMPTY STATE
                ====================================================== */}

            {!loading &&
              songs.length === 0 &&
              recentSongs.length === 0 && (
                <div className="empty-state">

                  <h2>
                    Welcome to TuneFlow AI
                  </h2>

                  <p>
                    Search for your favorite
                    music to get started.
                  </p>

                </div>
              )}

          </>
        )}

      </div>

      {/* ============================================================
          MUSIC PLAYER
          ============================================================ */}

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

      {/* ============================================================
          YOUTUBE PLAYER
          ============================================================ */}

      <YouTubePlayer
        videoId={
          currentSong?.videoId
        }

        isPlaying={isPlaying}

        volume={volume}

        onReady={
          handlePlayerReady
        }

        onEnd={
          handleSongEnd
        }

        seekTo={seekTo}
      />

    </div>
  );
}

export default Home;