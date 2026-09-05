import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaPlus,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">

      <div className="logo">
        🎵 <span>TuneFlow AI</span>
      </div>

      <div className="menu">

        <NavLink
          to="/"
          className="menu-item"
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        <div className="menu-item">
          <FaSearch />
          <span>Search</span>
        </div>

        <div className="menu-item">
          <FaMusic />
          <span>Your Library</span>
        </div>

        <NavLink
          to="/liked-songs"
          className={({ isActive }) =>
            `menu-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <FaHeart />
          <span>Liked Songs</span>
        </NavLink>

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