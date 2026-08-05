import "./MusicPlayer.css";
import ProgressBar from "./ProgressBar";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from "react-icons/fa";

function MusicPlayer({
  song,
  isPlaying,
  togglePlayPause,
  volume,
  setVolume,
  nextSong,
  previousSong,
  currentTime,
  duration,
  formatTime,
  seekTo,
}) {

  if (!song) return null;

  return (
    <div className="music-player">

      {/* LEFT */}
      <div className="player-left">
        <img
          src={song.thumbnail}
          alt={song.title}
        />

        <div>
          <h3>{song.title}</h3>
          <p>{song.channel}</p>
        </div>
      </div>

      {/* CENTER */}
      <div className="player-center">

        <div className="controls">

          <button onClick={previousSong}>
            <FaStepBackward />
          </button>

          <button
            className="play-btn"
            onClick={togglePlayPause}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button onClick={nextSong}>
            <FaStepForward />
          </button>

        </div>

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          formatTime={formatTime}
          seekTo={seekTo}
        />

      </div>

      {/* RIGHT */}
      <div className="player-right">

        <FaVolumeUp />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) =>
            setVolume(Number(e.target.value))
          }
        />

      </div>

    </div>
  );
}

export default MusicPlayer;