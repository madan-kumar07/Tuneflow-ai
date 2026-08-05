import { useEffect, useRef } from "react";
import YouTube from "react-youtube";

function YouTubePlayer({
  videoId,
  isPlaying,
  volume,
  onReady,
  onEnd,
}) {
  const playerRef = useRef(null);

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
    },
  };

  const handleReady = (event) => {
    playerRef.current = event.target;

    event.target.setVolume(volume * 100);

    if (onReady) {
      onReady(event.target);
    }

    if (isPlaying) {
      event.target.playVideo();
    }
  };

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return;

    playerRef.current.setVolume(volume * 100);
  }, [volume]);

  // useEffect(() => {
  //   if (!playerRef.current || !videoId) return;

  //   playerRef.current.loadVideoById(videoId);

  //   if (isPlaying) {
  //     playerRef.current.playVideo();
  //   }
  // }, [videoId]);

  if (!videoId) return null;

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={handleReady}
      onEnd={onEnd}
    />
  );
}

export default YouTubePlayer;