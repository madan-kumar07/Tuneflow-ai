import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaTimes,
  FaPlus,
  FaMusic,
  FaCheck,
} from "react-icons/fa";

import "./AddToPlaylistModal.css";

const API_BASE_URL = "http://localhost:8080";

const PLAYLISTS_URL =
  `${API_BASE_URL}/api/playlists`;

const AddToPlaylistModal = ({
  song,
  onClose,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
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
    } catch (err) {
      console.error(
        "Failed to load playlists:",
        err
      );

      setError(
        "Unable to load your playlists."
      );
    } finally {
      setLoading(false);
    }
  };

  const addSongToPlaylist = async (
    playlistId
  ) => {
    if (!song || addingId) {
      return;
    }

    /*
     * IMPORTANT
     *
     * YouTube search result may not have
     * database song ID.
     *
     * Backend playlist API requires songId.
     */

    let databaseSong = song;

    try {
      setAddingId(playlistId);
      setError("");

      /*
       * If YouTube result already has DB ID,
       * use it.
       */

      if (!databaseSong.id) {
        const songsResponse =
          await axios.get(
            `${API_BASE_URL}/api/songs`,
            {
              headers: getHeaders(),
            }
          );

        const databaseSongs =
          Array.isArray(
            songsResponse.data
          )
            ? songsResponse.data
            : [];

        databaseSong =
          databaseSongs.find(
            (item) =>
              item.videoId ===
              song.videoId
          );
      }

      /*
       * Song doesn't exist in DB.
       *
       * Create it first.
       */

      if (!databaseSong?.id) {
        const createResponse =
          await axios.post(
            `${API_BASE_URL}/api/songs`,
            {
              title:
                song.title ||
                "Unknown Title",

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

        databaseSong =
          createResponse.data;
      }

      if (!databaseSong?.id) {
        throw new Error(
          "Database song ID not found."
        );
      }

      /*
       * ADD SONG TO PLAYLIST
       */

      await axios.post(
        `${PLAYLISTS_URL}/${playlistId}/songs/${databaseSong.id}`,
        {},
        {
          headers: getHeaders(),
        }
      );

      /*
       * Mark as added in UI
       */

      setAddedIds((previous) => [
        ...previous,
        playlistId,
      ]);
    } catch (err) {
      console.error(
        "Failed to add song to playlist:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Session expired. Please login again."
        );
      } else if (
        err.response?.data?.message
      ) {
        setError(
          err.response.data.message
        );
      } else {
        setError(
          "Unable to add song to playlist."
        );
      }
    } finally {
      setAddingId(null);
    }
  };

  if (!song) {
    return null;
  }

  return (
    <div
      className="playlist-modal-overlay"
      onClick={onClose}
    >
      <div
        className="playlist-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}

        <div className="playlist-modal-header">
          <div>
            <span className="playlist-modal-label">
              ADD TO PLAYLIST
            </span>

            <h2>
              Add to playlist
            </h2>
          </div>

          <button
            type="button"
            className="playlist-modal-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* SONG */}

        <div className="playlist-selected-song">
          <img
            src={
              song.thumbnail ||
              song.imageUrl ||
              ""
            }
            alt={song.title}
          />

          <div>
            <h3>
              {song.title ||
                "Unknown Song"}
            </h3>

            <p>
              {song.channel ||
                song.artist ||
                "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="playlist-modal-error">
            {error}
          </div>
        )}

        {/* PLAYLISTS */}

        <div className="playlist-modal-content">
          {loading ? (
            <div className="playlist-modal-loading">
              Loading your playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="playlist-modal-empty">
              <div className="empty-playlist-icon">
                <FaMusic />
              </div>

              <h3>
                No playlists yet
              </h3>

              <p>
                Create a playlist first
                from Your Library.
              </p>
            </div>
          ) : (
            <div className="playlist-modal-list">
              {playlists.map(
                (playlist) => {
                  const isAdding =
                    addingId ===
                    playlist.id;

                  const isAdded =
                    addedIds.includes(
                      playlist.id
                    );

                  return (
                    <button
                      type="button"
                      className={`playlist-select-item ${
                        isAdded
                          ? "added"
                          : ""
                      }`}
                      key={
                        playlist.id
                      }
                      onClick={() =>
                        !isAdded &&
                        addSongToPlaylist(
                          playlist.id
                        )
                      }
                      disabled={
                        isAdding ||
                        isAdded
                      }
                    >
                      <div className="playlist-select-icon">
                        <FaMusic />
                      </div>

                      <div className="playlist-select-info">
                        <strong>
                          {
                            playlist.name
                          }
                        </strong>

                        <span>
                          {
                            playlist.songCount ||
                            0
                          }{" "}
                          songs
                        </span>
                      </div>

                      <div className="playlist-select-action">
                        {isAdding ? (
                          <span className="playlist-spinner" />
                        ) : isAdded ? (
                          <FaCheck />
                        ) : (
                          <FaPlus />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;