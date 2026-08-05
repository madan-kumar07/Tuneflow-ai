import React from "react";
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaPlus,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        🎵 <span>TuneFlow AI</span>
      </div>

      <div className="menu">
        <div className="menu-item active">
          <FaHome />
          <span>Home</span>
        </div>

        <div className="menu-item">
          <FaSearch />
          <span>Search</span>
        </div>

        <div className="menu-item">
          <FaMusic />
          <span>Your Library</span>
        </div>

        <div className="menu-item">
          <FaHeart />
          <span>Liked Songs</span>
        </div>

        <div className="menu-item">
          <FaPlus />
          <span>Create Playlist</span>
        </div>
      </div>

      <div className="playlists">
        <h4>PLAYLISTS</h4>

        <p>❤️ Tamil Hits</p>
        <p>🚗 Road Trip</p>
        <p>💪 Gym Beats</p>
        <p>🌙 Night Vibes</p>
        <p>🎧 Chill Mix</p>
      </div>
    </div>
  );
};

export default Sidebar;