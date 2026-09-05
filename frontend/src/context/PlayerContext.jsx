import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import YouTubePlayer from "../components/YouTubePlayer";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  /* ==============================
     NORMALIZE SONG
  ============================== */

  const normalizeSong = (song) => {
    if (!song) return null;

    return {
      ...song,

      videoId:
        song.videoId ||
        song.youtubeVideoId ||
        song.youtubeId ||
        "",

      thumbnail:
        song.thumbnail ||
        song.imageUrl ||
        "",

      channel:
        song.channel ||
        song.artist ||
        "Unknown Artist",

      title:
        song.title ||
        "Unknown Song",
    };
  };

  /* ==============================
     PLAY SONG
  ============================== */

  const playSong = (song, newQueue = null, index = null) => {
    const normalized = normalizeSong(song);

    if (!normalized?.videoId) {
      console.error("No videoId found:", song);
      return;
    }

    const finalQueue =
      Array.isArray(newQueue) && newQueue.length > 0
        ? newQueue.map(normalizeSong)
        : queue.length > 0
        ? queue
        : [normalized];

    let songIndex = index;

    if (songIndex === null || songIndex === undefined) {
      songIndex = finalQueue.findIndex(
        (item) => item.videoId === normalized.videoId
      );
    }

    if (songIndex < 0) {
      songIndex = 0;
    }

    setQueue(finalQueue);
    setCurrentIndex(songIndex);

    setCurrentTime(0);
    setDuration(0);

    setCurrentSong(normalized);
    setIsPlaying(true);

    /* Recently played */

    try {
      const saved =
        JSON.parse(
          localStorage.getItem("recentSongs") || "[]"
        );

      const updated = [
        normalized,
        ...saved.filter(
          (item) =>
            item.videoId !== normalized.videoId
        ),
      ].slice(0, 10);

      localStorage.setItem(
        "recentSongs",
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error(
        "Failed to save recent song:",
        error
      );
    }
  };

  /* ==============================
     NEXT SONG
  ============================== */

  const nextSong = () => {
    if (!queue.length) return;

    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;

      const next = queue[nextIndex];

      setCurrentIndex(nextIndex);
      setCurrentSong(normalizeSong(next));
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  /* ==============================
     PREVIOUS SONG
  ============================== */

  const previousSong = () => {
    if (!queue.length) return;

    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;

      const previous = queue[previousIndex];

      setCurrentIndex(previousIndex);
      setCurrentSong(normalizeSong(previous));
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    }
  };

  /* ==============================
     SONG END
  ============================== */

  const handleSongEnd = () => {
    if (!queue.length) {
      setIsPlaying(false);
      return;
    }

    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);
      setCurrentSong(
        normalizeSong(queue[nextIndex])
      );

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  /* ==============================
     PLAYER READY
  ============================== */

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    try {
      player.setVolume(volume * 100);

      if (isPlaying) {
        player.playVideo();
      }
    } catch (error) {
      console.error(
        "Player ready error:",
        error
      );
    }
  };

  /* ==============================
     PLAY / PAUSE
  ============================== */

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(
        "Play/pause error:",
        error
      );
    }
  };

  /* ==============================
     VOLUME
  ============================== */

  useEffect(() => {
    if (!playerRef.current) return;

    try {
      playerRef.current.setVolume(
        volume * 100
      );
    } catch (error) {
      console.error(
        "Volume error:",
        error
      );
    }
  }, [volume]);

  /* ==============================
     PROGRESS
  ============================== */

  useEffect(() => {
    if (!playerRef.current || !currentSong) {
      return;
    }

    if (progressIntervalRef.current) {
      clearInterval(
        progressIntervalRef.current
      );
    }

    progressIntervalRef.current =
      setInterval(() => {
        try {
          const current =
            playerRef.current.getCurrentTime() ||
            0;

          const total =
            playerRef.current.getDuration() ||
            0;

          setCurrentTime(current);
          setDuration(total);
        } catch (error) {
          // player may not be ready
        }
      }, 250);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(
          progressIntervalRef.current
        );

        progressIntervalRef.current = null;
      }
    };
  }, [currentSong]);

  /* ==============================
     SEEK
  ============================== */

  const seekTo = (time) => {
    if (!playerRef.current) return;

    const numericTime = Number(time);

    if (Number.isNaN(numericTime)) return;

    try {
      playerRef.current.seekTo(
        numericTime,
        true
      );

      setCurrentTime(numericTime);
    } catch (error) {
      console.error(
        "Seek error:",
        error
      );
    }
  };

  /* ==============================
     FORMAT TIME
  ============================== */

  const formatTime = (time) => {
    if (!time || Number.isNaN(Number(time))) {
      return "0:00";
    }

    const totalSeconds = Math.floor(
      Number(time)
    );

    const minutes = Math.floor(
      totalSeconds / 60
    );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        currentIndex,
        isPlaying,
        volume,
        currentTime,
        duration,

        setVolume,
        setIsPlaying,

        playSong,
        nextSong,
        previousSong,
        togglePlayPause,
        seekTo,
      }}
    >
      {children}

      {/* GLOBAL YOUTUBE PLAYER */}

      <div className="global-youtube-player">
        <YouTubePlayer
          videoId={currentSong?.videoId}
          isPlaying={isPlaying}
          volume={volume}
          onReady={handlePlayerReady}
          onEnd={handleSongEnd}
        />
      </div>
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used inside PlayerProvider"
    );
  }

  return context;
};