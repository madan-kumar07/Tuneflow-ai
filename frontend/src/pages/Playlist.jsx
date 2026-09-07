import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaPlay,
  FaMusic,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

import { usePlayer } from "../context/PlayerContext";

import "./Playlist.css";

const API_BASE_URL = "http://localhost:8080";
const PLAYLISTS_URL = `${API_BASE_URL}/api/playlists`;

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

const normalizeSong = (song) => {
  if (!song) return null;

  return {
    ...song,

    id: song.id,

    videoId:
      song.videoId ||
      song.youtubeVideoId ||
      song.youtubeId ||
      "",

    thumbnail:
      song.thumbnail ||
      song.imageUrl ||
      "",

    title:
      song.title ||
      "Unknown Song",

    artist:
      song.artist ||
      song.channel ||
      "Unknown Artist",

    channel:
      song.channel ||
      song.artist ||
      "Unknown Artist",
  };
};

const Playlist = () => {
  const navigate = useNavigate();

  const {
    playSong,
    currentSong,
    isPlaying,
  } = usePlayer();

  const [playlists, setPlaylists] = useState([]);

  const [showCreate, setShowCreate] =
    useState(false);

  const [playlistName, setPlaylistName] =
    useState("");

  const [playlistDescription, setPlaylistDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     LOAD PLAYLISTS
  ========================================================= */

  const loadPlaylists = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        PLAYLISTS_URL,
        {
          headers: getAuthHeaders(),
        }
      );

      const summaries = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      /*
       * Backend /api/playlists returns summaries.
       * Fetch every playlist's details so we get songs.
       */

      const detailedPlaylists =
        await Promise.all(
          summaries.map(async (playlist) => {
            try {
              const detailResponse =
                await axios.get(
                  `${PLAYLISTS_URL}/${playlist.id}`,
                  {
                    headers: getAuthHeaders(),
                  }
                );

              return {
                ...playlist,
                ...detailResponse.data,
                songs: Array.isArray(
                  detailResponse.data?.songs
                )
                  ? detailResponse.data.songs
                      .map(normalizeSong)
                      .filter(Boolean)
                  : [],
              };
            } catch (detailError) {
              console.error(
                `Failed to load playlist ${playlist.id}`,
                detailError
              );

              return {
                ...playlist,
                songs: [],
              };
            }
          })
        );

      setPlaylists(detailedPlaylists);
    } catch (err) {
      console.error(
        "Failed to load playlists:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        "Unable to load your playlists."
      );
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadPlaylists();
  }, []);

  /* =========================================================
     CREATE PLAYLIST
  ========================================================= */

  const createPlaylist = async () => {
    const name = playlistName.trim();
    const description =
      playlistDescription.trim();

    if (!name) {
      return;
    }

    if (actionLoading) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response =
        await axios.post(
          PLAYLISTS_URL,
          {
            name,
            description,
          },
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type":
                "application/json",
            },
          }
        );

      const createdPlaylist =
        response.data;

      setPlaylists((previous) => [
        {
          ...createdPlaylist,
          songs: [],
          songCount: 0,
        },
        ...previous,
      ]);

      setPlaylistName("");
      setPlaylistDescription("");
      setShowCreate(false);
    } catch (err) {
      console.error(
        "Failed to create playlist:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to create playlist."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     DELETE PLAYLIST
  ========================================================= */

  const deletePlaylist = async (
    playlistId
  ) => {
    if (!playlistId || actionLoading) {
      return;
    }

    const playlist =
      playlists.find(
        (item) =>
          item.id === playlistId
      );

    const confirmed = window.confirm(
      `Delete "${playlist?.name || "this playlist"}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await axios.delete(
        `${PLAYLISTS_URL}/${playlistId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setPlaylists((previous) =>
        previous.filter(
          (item) =>
            item.id !== playlistId
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete playlist:",
        err
      );

      setError(
        "Unable to delete playlist."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     REMOVE SONG
  ========================================================= */

  const removeSongFromPlaylist = async (
    playlistId,
    song
  ) => {
    if (
      !playlistId ||
      !song?.id ||
      actionLoading
    ) {
      return;
    }

    try {
      setActionLoading(true);

      await axios.delete(
        `${PLAYLISTS_URL}/${playlistId}/songs/${song.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setPlaylists((previous) =>
        previous.map((playlist) => {
          if (
            playlist.id !== playlistId
          ) {
            return playlist;
          }

          const updatedSongs =
            (playlist.songs || []).filter(
              (item) =>
                item.id !== song.id
            );

          return {
            ...playlist,
            songs: updatedSongs,
            songCount:
              updatedSongs.length,
          };
        })
      );
    } catch (err) {
      console.error(
        "Failed to remove song:",
        err
      );

      setError(
        "Unable to remove song."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     PLAY PLAYLIST
  ========================================================= */

  const playPlaylist = (
    playlist
  ) => {
    if (
      !playlist?.songs?.length
    ) {
      return;
    }

    playSong(
      playlist.songs[0],
      playlist.songs,
      0
    );
  };

  /* =========================================================
     PLAY INDIVIDUAL SONG
  ========================================================= */

  const handlePlaySong = (
    song,
    songs,
    index
  ) => {
    playSong(
      song,
      songs,
      index
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="playlist-page">
        <div className="playlist-loading">
          <FaSpinner className="spin" />

          <h2>
            Loading your playlists
          </h2>

          <p>
            Getting your music ready...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="playlist-page">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="playlist-header">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
          title="Back to Home"
        >
          <FaArrowLeft />
        </button>

        <div className="playlist-heading">

          <span className="playlist-label">
            YOUR LIBRARY
          </span>

          <h1>
            Your Playlists
          </h1>

          <p>
            Your music, your mood, your collection.
          </p>

        </div>

        <div className="playlist-header-count">
          <strong>
            {playlists.length}
          </strong>

          <span>
            {playlists.length === 1
              ? "playlist"
              : "playlists"}
          </span>
        </div>

      </header>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="playlist-error">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <FaTimes />
          </button>
        </div>
      )}


      {/* =====================================================
          CREATE SECTION
      ===================================================== */}

      <section className="playlist-create-section">

        <div>
          <h2>
            Build your collection
          </h2>

          <p>
            Create playlists for every moment.
          </p>
        </div>

        <button
          className="create-playlist-btn"
          onClick={() =>
            setShowCreate(
              (previous) => !previous
            )
          }
        >
          <FaPlus />
          Create Playlist
        </button>

      </section>


      {/* =====================================================
          CREATE FORM
      ===================================================== */}

      {showCreate && (
        <div className="create-playlist-box">

          <div className="create-form-icon">
            <FaMusic />
          </div>

          <div className="create-form-content">

            <label>
              Playlist name
            </label>

            <input
              type="text"
              value={playlistName}
              placeholder="e.g. Tamil Hits"
              maxLength={100}
              autoFocus
              onChange={(event) =>
                setPlaylistName(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  createPlaylist();
                }
              }}
            />

            <label>
              Description
            </label>

            <input
              type="text"
              value={playlistDescription}
              placeholder="A collection for your mood..."
              maxLength={255}
              onChange={(event) =>
                setPlaylistDescription(
                  event.target.value
                )
              }
            />

            <div className="create-form-actions">

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCreate(false);
                  setPlaylistName("");
                  setPlaylistDescription("");
                }}
                disabled={actionLoading}
              >
                Cancel
              </button>

              <button
                className="confirm-create-btn"
                onClick={createPlaylist}
                disabled={
                  actionLoading ||
                  !playlistName.trim()
                }
              >
                {actionLoading ? (
                  <FaSpinner className="spin" />
                ) : (
                  <FaPlus />
                )}

                Create Playlist
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {playlists.length === 0 ? (

        <div className="empty-playlists">

          <div className="empty-playlist-art">
            <FaMusic />
          </div>

          <h2>
            Nothing here yet
          </h2>

          <p>
            Create your first playlist and
            start building your personal
            music collection.
          </p>

          <button
            onClick={() =>
              setShowCreate(true)
            }
          >
            <FaPlus />
            Create Your First Playlist
          </button>

        </div>

      ) : (

        /* ===================================================
           PLAYLIST GRID
        =================================================== */

        <div className="playlist-container">

          {playlists.map((playlist) => {

            const songs =
              Array.isArray(
                playlist.songs
              )
                ? playlist.songs
                : [];

            const songCount =
              songs.length ||
              Number(
                playlist.songCount || 0
              );

            const coverSongs =
              songs
                .slice(0, 4)
                .map(
                  (song) =>
                    song.thumbnail ||
                    song.imageUrl
                )
                .filter(Boolean);

            return (
              <section
                className="playlist-section"
                key={playlist.id}
              >

                {/* PLAYLIST CARD HEADER */}

                <div className="playlist-card-header">

                  <div className="playlist-cover">

                    {coverSongs.length === 0 ? (

                      <div className="playlist-cover-empty">
                        <FaMusic />
                      </div>

                    ) : (

                      <div className="playlist-cover-grid">

                        {coverSongs.map(
                          (
                            image,
                            index
                          ) => (
                            <img
                              key={`${image}-${index}`}
                              src={image}
                              alt=""
                            />
                          )
                        )}

                      </div>

                    )}

                  </div>


                  <div className="playlist-card-info">

                    <span>
                      PLAYLIST
                    </span>

                    <h2>
                      {playlist.name}
                    </h2>

                    <p>
                      {playlist.description ||
                        "Your personal collection"}
                    </p>

                    <small>
                      {songCount}{" "}
                      {songCount === 1
                        ? "song"
                        : "songs"}
                    </small>

                  </div>


                  <div className="playlist-card-actions">

                    <button
                      className="playlist-play-btn"
                      onClick={() =>
                        playPlaylist(
                          playlist
                        )
                      }
                      disabled={
                        songs.length === 0
                      }
                      title="Play playlist"
                    >
                      <FaPlay />
                    </button>

                    <button
                      className="playlist-delete-btn"
                      onClick={() =>
                        deletePlaylist(
                          playlist.id
                        )
                      }
                      title="Delete playlist"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>


                {/* SONG LIST */}

                {songs.length > 0 ? (

                  <div className="playlist-songs">

                    <div className="playlist-songs-header">

                      <span>
                        #
                      </span>

                      <span>
                        TITLE
                      </span>

                      <span>
                        ACTION
                      </span>

                    </div>

                    {songs.map(
                      (
                        song,
                        index
                      ) => {

                        const playing =
                          currentSong?.videoId ===
                            song.videoId &&
                          isPlaying;

                        return (
                          <div
                            className={`playlist-song ${
                              playing
                                ? "playing"
                                : ""
                            }`}
                            key={
                              song.id ||
                              song.videoId
                            }
                          >

                            <span className="song-index">
                              {playing ? (
                                <span className="playing-bars">
                                  <i />
                                  <i />
                                  <i />
                                </span>
                              ) : (
                                index + 1
                              )}
                            </span>


                            <div className="playlist-song-main">

                              <img
                                src={
                                  song.thumbnail ||
                                  song.imageUrl ||
                                  ""
                                }
                                alt={
                                  song.title
                                }
                              />

                              <div className="playlist-song-info">

                                <h3
                                  title={
                                    song.title
                                  }
                                >
                                  {song.title}
                                </h3>

                                <p
                                  title={
                                    song.artist ||
                                    song.channel
                                  }
                                >
                                  {song.artist ||
                                    song.channel ||
                                    "Unknown Artist"}
                                </p>

                              </div>

                            </div>


                            <div className="playlist-song-actions">

                              <button
                                className="song-play-btn"
                                onClick={() =>
                                  handlePlaySong(
                                    song,
                                    songs,
                                    index
                                  )
                                }
                                title={
                                  playing
                                    ? "Pause"
                                    : "Play"
                                }
                              >
                                {playing ? (
                                  "❚❚"
                                ) : (
                                  "▶"
                                )}
                              </button>

                              <button
                                className="song-remove-btn"
                                onClick={() =>
                                  removeSongFromPlaylist(
                                    playlist.id,
                                    song
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                title="Remove from playlist"
                              >
                                <FaTimes />
                              </button>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  <div className="playlist-empty">

                    <FaMusic />

                    <div>
                      <strong>
                        This playlist is empty
                      </strong>

                      <span>
                        Add songs from Home or Search
                      </span>
                    </div>

                  </div>

                )}

              </section>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Playlist;