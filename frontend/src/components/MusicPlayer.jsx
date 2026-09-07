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

  if (!song) {
    return null;
  }


  return (
    <div className="music-player">

      {/* =====================================================
          LEFT — CURRENT SONG
          ===================================================== */}

      <div className="player-left">

        <div className="player-cover-wrap">

          <img
            src={song.thumbnail}
            alt={song.title}
            className="player-cover"
          />

          <div className="player-cover-glow" />

        </div>


        <div className="player-song-info">

          <h3 title={song.title}>
            {song.title}
          </h3>

          <p title={song.channel}>
            {song.channel}
          </p>

        </div>

      </div>


      {/* =====================================================
          CENTER — CONTROLS + PROGRESS
          ===================================================== */}

      <div className="player-center">

        <div className="player-controls">

          <button
            type="button"
            className="player-control"
            onClick={previousSong}
            title="Previous"
            aria-label="Previous song"
          >
            <FaStepBackward />
          </button>


          <button
            type="button"
            className="player-play-button"
            onClick={togglePlayPause}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying
              ? <FaPause />
              : <FaPlay />
            }
          </button>


          <button
            type="button"
            className="player-control"
            onClick={nextSong}
            title="Next"
            aria-label="Next song"
          >
            <FaStepForward />
          </button>

        </div>


        <div className="player-progress">

          <span className="player-time">
            {formatTime(currentTime)}
          </span>

          <div className="player-progress-bar">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              formatTime={formatTime}
              seekTo={seekTo}
            />
          </div>

          <span className="player-time">
            {formatTime(duration)}
          </span>

        </div>

      </div>


      {/* =====================================================
          RIGHT — VOLUME
          ===================================================== */}

      <div className="player-right">

        <FaVolumeUp className="volume-icon" />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) =>
            setVolume(Number(event.target.value))
          }
          aria-label="Volume"
        />

      </div>

    </div>
  );
}


export default MusicPlayer;