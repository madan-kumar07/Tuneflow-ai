import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaPlus,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";

import "./Sidebar.css";

const API_URL = "http://localhost:8080/api/playlists";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const token = localStorage.getItem("token");

  /* =========================================
     LOAD PLAYLISTS
  ========================================= */

  useEffect(() => {
    const loadPlaylists = async () => {
      if (!token) return;

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlaylists(response.data || []);
      } catch (error) {
        console.error("Failed to load playlists:", error);
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

  const goSearch = () => {
    navigate("/");
  };

  const goLibrary = () => {
    navigate("/playlists");
  };

  const goLiked = () => {
    navigate("/liked-songs");
  };

  const createPlaylist = () => {
    navigate("/playlists?create=true");
  };

  const openPlaylist = (id) => {
    navigate(`/playlists/${id}`);
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      {/* =====================================
          TOP
      ===================================== */}

      <div className="sidebar-top">

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <FaBars />
          ) : (
            <FaChevronLeft />
          )}
        </button>

        {!collapsed && (
          <div className="sidebar-brand">
            <span className="brand-icon">🎵</span>

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


        <button
          className="sidebar-item"
          onClick={goSearch}
          title="Search"
        >
          <FaSearch />

          <span className="sidebar-label">
            Search
          </span>
        </button>


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
              <span>No playlists yet</span>
            </div>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                className={`sidebar-playlist ${
                  location.pathname ===
                  `/playlists/${playlist.id}`
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  openPlaylist(playlist.id)
                }
                title={playlist.name}
              >
                <span className="playlist-mini-icon">
                  🎵
                </span>

                <span className="playlist-title">
                  {playlist.name}
                </span>
              </button>
            ))
          )}

        </div>
      )}

    </aside>
  );
};

export default Sidebar;