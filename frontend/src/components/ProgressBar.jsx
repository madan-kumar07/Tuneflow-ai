import "./ProgressBar.css";

function ProgressBar({
  currentTime,
  duration,
  formatTime,
  seekTo,
}) {
  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const handleSeek = (e) => {
    if (!duration) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const percent =
      (e.clientX - rect.left) / rect.width;

    seekTo(percent * duration);
  };

  return (
    <div className="progress-container">

      <span className="time">
        {formatTime(currentTime)}
      </span>

      <div
        className="progress"
        onClick={handleSeek}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>

      <span className="time">
        {formatTime(duration)}
      </span>

    </div>
  );
}

export default ProgressBar;