import { useEffect, useState } from "react";
import { FaClock, FaHistory, FaPlay, FaTrash, FaMusic } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getHistory, clearHistory } from "../service/historyService";
import { usePlayer } from "../context/PlayerContext";

import "./History.css";

/* ==============================
   NORMALIZE SONG
============================== */

const normalizeSong = (song) => {
  if (!song) {
    return null;
  }

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

    artist:
      song.artist ||
      song.channel ||
      "Unknown Artist",

    channel:
      song.channel ||
      song.artist ||
      "Unknown Artist",

    thumbnail:
      song.thumbnail ||
      song.imageUrl ||
      "",

    imageUrl:
      song.imageUrl ||
      song.thumbnail ||
      "",
  };
};

/* ==============================
   HISTORY PAGE (SPOTIFY STYLE)
============================== */

function History() {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [clearing, setClearing] =
    useState(false);

  const [hoveredRow, setHoveredRow] =
    useState(null);

  const {
    playSong,
    currentSong,
    isPlaying,
  } = usePlayer();

  /* ==============================
     LOAD HISTORY
  ============================== */

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getHistory();

      if (Array.isArray(response)) {
        const songs = response
          .map(normalizeSong)
          .filter(
            (song) => song?.videoId
          );

        setHistory(songs);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(
        "Failed to load history:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to load listening history."
        );
      }

      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     INITIAL LOAD
  ============================== */

  useEffect(() => {
    loadHistory();
  }, []);

  /* ==============================
     PLAY HISTORY SONG
  ============================== */

  const handlePlaySong = (
    song,
    index
  ) => {
    const normalized =
      normalizeSong(song);

    if (!normalized?.videoId) {
      return;
    }

    const queue = history
      .map(normalizeSong)
      .filter(
        (item) => item?.videoId
      );

    playSong(
      normalized,
      queue,
      index
    );
  };

  /* ==============================
     CLEAR HISTORY
  ============================== */

  const handleClearHistory = async () => {
    if (!history.length) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to clear your entire listening history?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);

      await clearHistory();

      setHistory([]);
    } catch (err) {
      console.error(
        "Failed to clear history:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        alert(
          "Your session has expired. Please login again."
        );
      } else {
        alert(
          "Unable to clear listening history."
        );
      }
    } finally {
      setClearing(false);
    }
  };

  /* ==============================
     FORMAT DATE
  ============================== */

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* ==============================
     RENDER
  ============================== */

  return (
    <div className="spotify-history-page">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="spotify-history-content">

        {/* NAVBAR */}
        <Navbar />

        {/* SPOTIFY HERO HEADER */}
        <header className="spotify-history-header">
          <div className="header-gradient-bg" />

          <div className="header-info-container">
            <div className="header-cover-art">
              <FaHistory className="header-cover-icon" />
            </div>

            <div className="header-text-details">
              <span className="header-eyebrow">
                YOUR LISTENING
              </span>

              <h1 className="header-title">
                Listening History
              </h1>

              <p className="header-description">
                Songs you've recently played on TuneFlow AI.
              </p>

              <div className="header-meta">
                <span className="meta-badge">
                  {history.length}{" "}
                  {history.length === 1
                    ? "track"
                    : "tracks"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ACTION BAR */}
        <div className="spotify-action-bar">
          {history.length > 0 && (
            <>
              <button
                className="spotify-main-play-btn"
                onClick={() =>
                  handlePlaySong(
                    history[0],
                    0
                  )
                }
                title="Play History"
              >
                <FaPlay className="play-icon-svg" />
              </button>

              <button
                className="spotify-clear-btn"
                onClick={
                  handleClearHistory
                }
                disabled={clearing}
              >
                <FaTrash />
                {clearing
                  ? "Clearing..."
                  : "Clear history"}
              </button>
            </>
          )}
        </div>

        {/* CONTENT BODY */}
        <div className="spotify-history-body">

          {/* LOADING */}
          {loading && (
            <div className="spotify-state-container">
              <div className="spotify-spinner" />
              <h3>Loading history...</h3>
              <p>Fetching your recently played tracks.</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="spotify-state-container error">
              <div className="state-icon-circle">!</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button
                className="spotify-retry-btn"
                onClick={loadHistory}
              >
                Try again
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            history.length === 0 && (
              <div className="spotify-state-container empty">
                <div className="empty-icon-wrap">
                  <FaClock />
                </div>
                <h2>No listening history yet</h2>
                <p>
                  Start playing your favorite music and it will show up here.
                </p>
              </div>
            )}

          {/* TRACK LIST TABLE */}
          {!loading &&
            !error &&
            history.length > 0 && (
              <div className="spotify-table-wrapper">

                {/* TABLE HEADER */}
                <div className="spotify-table-header">
                  <div className="col-num">#</div>
                  <div className="col-title">TITLE</div>
                  <div className="col-date">PLAYED AT</div>
                  <div className="col-action"></div>
                </div>

                {/* TABLE ROWS */}
                <div className="spotify-table-body">
                  {history.map(
                    (song, index) => {
                      const isCurrent =
                        currentSong?.videoId &&
                        currentSong.videoId ===
                          song.videoId;

                      return (
                        <div
                          key={`${song.videoId}-${index}`}
                          className={`spotify-track-row ${
                            isCurrent
                              ? "is-playing"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            setHoveredRow(
                              index
                            )
                          }
                          onMouseLeave={() =>
                            setHoveredRow(
                              null
                            )
                          }
                          onClick={() =>
                            handlePlaySong(
                              song,
                              index
                            )
                          }
                        >

                          {/* # OR PLAY ICON */}
                          <div className="col-num">
                            {hoveredRow ===
                            index ? (
                              <FaPlay className="row-play-icon" />
                            ) : isCurrent &&
                              isPlaying ? (
                              <span className="playing-equalizer">
                                <span className="eq-bar bar1" />
                                <span className="eq-bar bar2" />
                                <span className="eq-bar bar3" />
                              </span>
                            ) : (
                              <span className="row-index">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* TITLE & ARTIST */}
                          <div className="col-title">
                            <div className="track-thumb">
                              {song.thumbnail ? (
                                <img
                                  src={
                                    song.thumbnail
                                  }
                                  alt={
                                    song.title
                                  }
                                />
                              ) : (
                                <div className="thumb-placeholder">
                                  <FaMusic />
                                </div>
                              )}
                            </div>

                            <div className="track-meta">
                              <span
                                className={`track-name ${
                                  isCurrent
                                    ? "active-green"
                                    : ""
                                }`}
                              >
                                {song.title}
                              </span>

                              <span className="track-artist">
                                {song.artist ||
                                  "Unknown Artist"}
                              </span>
                            </div>
                          </div>

                          {/* PLAYED AT */}
                          <div className="col-date">
                            <span>
                              {formatDate(
                                song.playedAt ||
                                  song.createdAt
                              )}
                            </span>
                          </div>

                          {/* ACTION BUTTON */}
                          <div className="col-action">
                            <button
                              className="row-action-play"
                              onClick={(
                                e
                              ) => {
                                e.stopPropagation();
                                handlePlaySong(
                                  song,
                                  index
                                );
                              }}
                              title="Play"
                            >
                              <FaPlay />
                            </button>
                          </div>

                        </div>
                      );
                    }
                  )}
                </div>

              </div>
            )}

        </div>

      </main>

    </div>
  );
}

export default History;