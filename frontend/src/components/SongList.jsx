import "./SongList.css";
import SongCard from "./SongCard";

function SongList({
  songs,
  playSong,
  toggleLike,
  likedSongs,
}) {
  if (!songs || songs.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">🎵</div>
        <h2>No Songs Found</h2>
        <p>Search your favourite songs...</p>
      </div>
    );
  }

  return (

    <div className="song-grid">

      {songs.map((song) => (

        <SongCard
          key={song.videoId}
          song={song}
          playSong={playSong}
          toggleLike={toggleLike}
          likedSongs={likedSongs}
        />

      ))}

    </div>

  );
}

export default SongList;