import "./SongCard.css";

import {
  FaPlay,
  FaHeart,
  FaRegHeart,
  FaPlus,
} from "react-icons/fa";

function SongCard({
  song,
  playSong,
  toggleLike,
  likedSongs,
  onAddToPlaylist,
}) {
  const liked =
    likedSongs?.some(
      (s) =>
        s.videoId &&
        song.videoId &&
        s.videoId === song.videoId
    ) || false;

  const handleAddToPlaylist = (event) => {
    event.stopPropagation();

    if (onAddToPlaylist) {
      onAddToPlaylist(song);
    }
  };

  const handlePlay = (event) => {
    event.stopPropagation();

    if (playSong) {
      playSong(song);
    }
  };

  const handleLike = (event) => {
    event.stopPropagation();

    if (toggleLike) {
      toggleLike(song);
    }
  };

  return (
    <div className="song-card">
      {/* =========================
          IMAGE
      ========================= */}

      <div className="image-box">
        <img
          src={
            song.thumbnail ||
            song.imageUrl ||
            ""
          }
          alt={song.title || "Song"}
        />

        {/* PLAY BUTTON */}

        <button
          type="button"
          className="play-button"
          onClick={handlePlay}
          title="Play song"
        >
          <FaPlay />
        </button>

        {/* ADD TO PLAYLIST */}

        {onAddToPlaylist && (
          <button
            type="button"
            className="add-playlist-button"
            onClick={handleAddToPlaylist}
            title="Add to playlist"
          >
            <FaPlus />
          </button>
        )}
      </div>

      {/* =========================
          SONG INFO
      ========================= */}

      <div className="song-card-info">
        <h3 title={song.title}>
          {song.title || "Unknown Song"}
        </h3>

        <p title={song.channel}>
          {song.channel ||
            song.artist ||
            "Unknown Artist"}
        </p>
      </div>

      {/* =========================
          LIKE
      ========================= */}

      <button
        type="button"
        className={`like-button ${
          liked ? "liked" : ""
        }`}
        onClick={handleLike}
        title={
          liked
            ? "Unlike song"
            : "Like song"
        }
      >
        {liked ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}
      </button>
    </div>
  );
}

export default SongCard;