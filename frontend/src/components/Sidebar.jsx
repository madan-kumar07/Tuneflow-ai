import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaPlus,
  FaBars,
  FaChevronLeft,
  FaHistory,
} from "react-icons/fa";

import "./Sidebar.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080"
).replace(/\/$/, "");

const API_URL = `${API_BASE_URL}/api/playlists`;

const Sidebar = ({
  onCreatePlaylist,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] =
    useState(false);

  const [playlists, setPlaylists] =
    useState([]);

  const token =
    localStorage.getItem("token");

  /* =========================================
     LOAD PLAYLISTS
  ========================================= */

  useEffect(() => {
    const loadPlaylists = async () => {
      if (!token) {
        setPlaylists([]);
        return;
      }

      try {
        const response = await axios.get(
          API_URL,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setPlaylists(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load playlists:",
          error
        );

        setPlaylists([]);
      }
    };

    loadPlaylists();
  }, [token, location.pathname]);

  /* =========================================
     NAVIGATION
  ========================================= */

  const goHome = () => {
    navigate("/");
  };

  // IMPORTANT:
  // Sidebar Search only navigates to Search page.
  // It does NOT call the YouTube API.
  const goSearch = () => {
  if (location.pathname !== "/") {
    navigate("/");
    
    setTimeout(() => {
      const searchInput = document.querySelector(
        ".premium-search-input"
      );

      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 150);

    return;
  }

  const searchInput = document.querySelector(
    ".premium-search-input"
  );

  if (searchInput) {
    searchInput.focus();
    searchInput.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

  const goLibrary = () => {
    navigate("/playlists");
  };

  const goLiked = () => {
    navigate("/liked-songs");
  };

  const goHistory = () => {
    navigate("/history");
  };

  /* =========================================
     CREATE PLAYLIST
  ========================================= */

  const createPlaylist = () => {
    if (onCreatePlaylist) {
      onCreatePlaylist();
      return;
    }

    navigate("/playlists?create=true");
  };

  /* =========================================
     OPEN PLAYLIST
  ========================================= */

  const openPlaylist = (id) => {
    navigate(`/playlists/${id}`);
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <aside
      className={`sidebar ${
        collapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >

      {/* =====================================
          TOP
      ===================================== */}

      <div className="sidebar-top">

        <button
          className="sidebar-toggle"
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <FaBars />
          ) : (
            <FaChevronLeft />
          )}
        </button>

        {!collapsed && (
          <div className="sidebar-brand">

            <span className="brand-icon">
              🎵
            </span>

            <span className="brand-text">
              TuneFlow AI
            </span>

          </div>
        )}

      </div>

      {/* =====================================
          NAVIGATION
      ===================================== */}

      <nav className="sidebar-menu">

        {/* HOME */}

        <button
          className={`sidebar-item ${
            location.pathname === "/"
              ? "active"
              : ""
          }`}
          onClick={goHome}
          title="Home"
        >
          <FaHome />

          <span className="sidebar-label">
            Home
          </span>
        </button>


        {/* SEARCH */}

        <button
          className={`sidebar-item ${
            location.pathname === "/"
              ? "active"
              : ""
          }`}
          onClick={goSearch}
          title="Search"
        >
          <FaSearch />

          <span className="sidebar-label">
            Search
          </span>
        </button>


        {/* YOUR LIBRARY */}

        <button
          className={`sidebar-item ${
            location.pathname.startsWith(
              "/playlists"
            )
              ? "active"
              : ""
          }`}
          onClick={goLibrary}
          title="Your Library"
        >
          <FaMusic />

          <span className="sidebar-label">
            Your Library
          </span>
        </button>


        {/* LIKED SONGS */}

        <button
          className={`sidebar-item ${
            location.pathname ===
            "/liked-songs"
              ? "active"
              : ""
          }`}
          onClick={goLiked}
          title="Liked Songs"
        >
          <FaHeart />

          <span className="sidebar-label">
            Liked Songs
          </span>
        </button>


        {/* HISTORY */}

        <button
          className={`sidebar-item ${
            location.pathname ===
            "/history"
              ? "active"
              : ""
          }`}
          onClick={goHistory}
          title="Listening History"
        >
          <FaHistory />

          <span className="sidebar-label">
            History
          </span>
        </button>


        {/* CREATE PLAYLIST */}

        <button
          className="sidebar-item"
          onClick={createPlaylist}
          title="Create Playlist"
        >
          <FaPlus />

          <span className="sidebar-label">
            Create Playlist
          </span>
        </button>

      </nav>


      {/* =====================================
          PLAYLISTS
      ===================================== */}

      {!collapsed && (
        <div className="sidebar-playlists">

          <div className="playlist-heading">
            PLAYLISTS
          </div>


          {playlists.length === 0 ? (

            <div className="no-playlists">

              <FaMusic />

              <span>
                No playlists yet
              </span>

            </div>

          ) : (

            playlists.map(
              (playlist) => (

                <button
                  key={playlist.id}
                  className={`sidebar-playlist ${
                    location.pathname ===
                    `/playlists/${playlist.id}`
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    openPlaylist(
                      playlist.id
                    )
                  }
                  title={
                    playlist.name
                  }
                >

                  <span className="playlist-mini-icon">
                    🎵
                  </span>

                  <span className="playlist-title">
                    {playlist.name}
                  </span>

                </button>

              )
            )

          )}

        </div>
      )}

    </aside>
  );
};

export default Sidebar;