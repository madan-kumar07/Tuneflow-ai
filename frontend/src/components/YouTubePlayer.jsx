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
    height: "1",
    width: "1",
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

    try {
      event.target.setVolume(volume * 100);

      if (onReady) {
        onReady(event.target);
      }

      if (isPlaying) {
        event.target.playVideo();
      }
    } catch (error) {
      console.log("YouTube player ready error:", error);
    }
  };

  const handleEnd = () => {
    if (onEnd) {
      onEnd();
    }
  };

  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.log("YouTube play/pause error:", error);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return;

    try {
      playerRef.current.setVolume(volume * 100);
    } catch (error) {
      console.log("YouTube volume error:", error);
    }
  }, [volume]);

  // Important:
  // When song changes, force YouTube player to create a fresh instance.
  useEffect(() => {
    playerRef.current = null;

    return () => {
      playerRef.current = null;
    };
  }, [videoId]);

  if (!videoId) {
    return null;
  }

  return (
    <YouTube
      key={videoId}
      videoId={videoId}
      opts={opts}
      onReady={handleReady}
      onEnd={handleEnd}
    />
  );
}

export default YouTubePlayer;