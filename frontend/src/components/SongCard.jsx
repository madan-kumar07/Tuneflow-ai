import "./SongCard.css";
import { FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";

function SongCard({ song, playSong, toggleLike, likedSongs }) {

  const liked = likedSongs.some(
    (s) => s.videoId === song.videoId
  );

  return (

    <div className="song-card">

      <div className="image-box">

        <img
          src={song.thumbnail}
          alt={song.title}
        />

        <button
          className="play-button"
          onClick={() => playSong(song)}
        >
          <FaPlay />
        </button>

      </div>

      <h3>{song.title}</h3>

      <p>{song.channel}</p>

      <button
        className="like-button"
        onClick={() => toggleLike(song)}
      >

        {liked ? <FaHeart /> : <FaRegHeart />}

      </button>

    </div>

  );

}

export default SongCard;