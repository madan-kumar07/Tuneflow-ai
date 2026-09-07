import "./SongList.css";
import SongCard from "./SongCard";

function SongList({
  songs,
  playSong,
  toggleLike,
  likedSongs,
  onAddToPlaylist,
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
      {songs.map((song, index) => (
        <SongCard
          key={
            song.videoId ||
            song.id ||
            index
          }
          song={song}
          playSong={playSong}
          toggleLike={toggleLike}
          likedSongs={likedSongs}
          onAddToPlaylist={onAddToPlaylist}
        />
      ))}
    </div>
  );
}

export default SongList;