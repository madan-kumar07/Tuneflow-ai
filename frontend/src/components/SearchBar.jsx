import React from "react";

import {
  FaHome,
  FaMusic,
  FaHeart,
  FaPlus,
  FaListUl,
} from "react-icons/fa";

import "./Sidebar.css";


const Sidebar = () => {

  const goHome = () => {
    window.location.href = "/";
  };

  const goLibrary = () => {
    window.location.href = "/library";
  };

  const goLiked = () => {
    window.location.href = "/liked";
  };

  const createPlaylist = () => {
    /*
      Home page already owns the playlist modal.
      Keep this action safe here instead of breaking
      the existing Home playlist logic.
    */

    const createButton =
      document.querySelector(".create-playlist-row");

    if (createButton) {
      createButton.click();
      return;
    }

    /*
      If the modal isn't currently mounted,
      go to the home page where playlist creation
      is available.
    */
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  };


  return (
    <aside className="sidebar">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div
        className="sidebar-brand"
        onClick={goHome}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            goHome();
          }
        }}
      >

        <div className="brand-icon">
          <FaMusic />
        </div>

        <div className="brand-text">
          <strong>TuneFlow</strong>
          <span>AI MUSIC</span>
        </div>

      </div>


      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <nav className="sidebar-nav">

        {/* HOME */}

        <button
          type="button"
          className="sidebar-nav-item active"
          onClick={goHome}
        >
          <span className="nav-icon">
            <FaHome />
          </span>

          <span className="nav-label">
            Home
          </span>
        </button>


        {/* LIBRARY */}

        <button
          type="button"
          className="sidebar-nav-item"
          onClick={goLibrary}
        >
          <span className="nav-icon">
            <FaMusic />
          </span>

          <span className="nav-label">
            Your Library
          </span>
        </button>


        {/* LIKED */}

        <button
          type="button"
          className="sidebar-nav-item"
          onClick={goLiked}
        >
          <span className="nav-icon">
            <FaHeart />
          </span>

          <span className="nav-label">
            Liked Songs
          </span>
        </button>

      </nav>


      {/* =====================================================
          QUICK ACTION
      ===================================================== */}

      <div className="sidebar-divider" />


      <div className="sidebar-section-label">
        YOUR MUSIC
      </div>


      <button
        type="button"
        className="playlist-create-button"
        onClick={createPlaylist}
      >

        <span className="playlist-create-icon">
          <FaPlus />
        </span>

        <span className="playlist-create-content">

          <strong>
            Create Playlist
          </strong>

          <small>
            Build your collection
          </small>

        </span>

        <FaListUl className="playlist-list-icon" />

      </button>


      {/* =====================================================
          BOTTOM BRAND / PREMIUM
      ===================================================== */}

      <div className="sidebar-spacer" />


      <div className="sidebar-premium">

        <div className="premium-glow" />

        <div className="premium-icon">
          ✦
        </div>

        <div className="premium-content">

          <strong>
            TuneFlow AI
          </strong>

          <span>
            Music made personal.
          </span>

        </div>

      </div>


      <div className="sidebar-footer">

        <span className="status-dot" />

        <span>
          All systems ready
        </span>

      </div>

    </aside>
  );
};


export default Sidebar;