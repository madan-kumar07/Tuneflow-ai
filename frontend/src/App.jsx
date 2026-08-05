import { useState, useEffect } from "react";
import axios from "axios";
import YouTubePlayer from "./components/YouTubePlayer";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import MusicPlayer from "./components/MusicPlayer";

function App() {

  const [query, setQuery] = useState("");

  const [songs, setSongs] = useState([]);

  const [currentSong, setCurrentSong] = useState(null);

  const [loading, setLoading] = useState(false);

  const [recentSongs, setRecentSongs] = useState([]);

  const [likedSongs, setLikedSongs] = useState([]);

  const [volume, setVolume] = useState(1);

  const [isPlaying, setIsPlaying] = useState(false);

  const [player, setPlayer] = useState(null);  

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {

    const recent = JSON.parse(localStorage.getItem("recentSongs"));

    if (recent) {

      setRecentSongs(recent);

    }

    const liked = JSON.parse(localStorage.getItem("likedSongs"));

    if (liked) {

      setLikedSongs(liked);

    }

  }, []);

  const searchSongs = async () => {

    if (query.trim() === "") return;

    try {

      setLoading(true);

      const response = await axios.get(
        "http://10.236.118.138:8080/api/youtube/search",
        {
          params: {
            query: query,
          },
        }
      );

      if (Array.isArray(response.data)) {

        setSongs(response.data);

      } else {

        setSongs([]);

      }

    } catch (err) {

      console.log(err);

      setSongs([]);

    } finally {

      setLoading(false);

    }

  };

  const playSong = (song, index = null) => {

  const songIndex =
    index !== null
      ? index
      : songs.findIndex(
          (s) => s.videoId === song.videoId
        );

  setCurrentIndex(songIndex);

  setCurrentTime(0);
  setDuration(0);

  setCurrentSong(song);
  setIsPlaying(true);

  const updatedRecent = [
    song,
    ...recentSongs.filter(
      (s) => s.videoId !== song.videoId
    ),
  ];

  setRecentSongs(updatedRecent);

  localStorage.setItem(
    "recentSongs",
    JSON.stringify(updatedRecent)
  );
};

  const toggleLike = (song) => {

    let updated = [];

    const exists = likedSongs.find(
      (s) => s.videoId === song.videoId
    );

    if (exists) {

      updated = likedSongs.filter(
        (s) => s.videoId !== song.videoId
      );

    } else {

      updated = [...likedSongs, song];

    }

    setLikedSongs(updated);

    localStorage.setItem(
      "likedSongs",
      JSON.stringify(updated)
    );

  };

  const nextSong = () => {

  if (currentIndex < songs.length - 1) {

    playSong(
      songs[currentIndex + 1],
      currentIndex + 1
    );

  }

};

  const handleSongEnd = () => {

  if (currentIndex < songs.length - 1) {

    playSong(
      songs[currentIndex + 1],
      currentIndex + 1
    );

  } else {

    // Last song reached
    setIsPlaying(false);

  }

};

  const previousSong = () => {

  if (currentIndex > 0) {

    playSong(
      songs[currentIndex - 1],
      currentIndex - 1
    );

  }

};

useEffect(() => {
  if (!player || !currentSong) return;

  const interval = setInterval(() => {
    try {
      const current = player.getCurrentTime() || 0;
      const total = player.getDuration() || 0;

      setCurrentTime(current);
      setDuration(total);
    } catch (err) {}
  }, 250);

  return () => clearInterval(interval);
}, [player, currentSong]);

const formatTime = (time) => {

    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;

};

  const seekTo = (time) => {

  if (!player) return;

  player.seekTo(time, true);

  setCurrentTime(time);

};

  const togglePlayPause = () => {

  if (!player) return;

  if (isPlaying) {

    player.pauseVideo();

    setIsPlaying(false);

  } else {

    player.playVideo();

    setIsPlaying(true);

  }

};


  return (

    <div className="app">

      <Sidebar />

      <div className="main">

        <Navbar />

        <SearchBar
          query={query}
          setQuery={setQuery}
          searchSongs={searchSongs}
        />

        {loading ? (

          <div className="loading">
            <div className="loading-spinner"></div>
            <span className="loading-text">Finding your music...</span>
          </div>

        ) : (

          <>

            {songs.length > 0 && (

              <>

                <h2 className="section-title">

                  Search Results

                </h2>

                <SongList
                  songs={songs}
                  playSong={playSong}
                  toggleLike={toggleLike}
                  likedSongs={likedSongs}
                />

              </>

            )}

            {recentSongs.length > 0 && (

              <>

                <h2 className="section-title">

                  Recently Played

                </h2>

                <SongList
                  songs={recentSongs}
                  playSong={playSong}
                  toggleLike={toggleLike}
                  likedSongs={likedSongs}
                />

              </>

            )}

          </>

        )}

      </div>

      <MusicPlayer

    song={currentSong}

    isPlaying={isPlaying}

    togglePlayPause={togglePlayPause}

    volume={volume}

    setVolume={setVolume}

    nextSong={nextSong}

    previousSong={previousSong}

    currentTime={currentTime}

    duration={duration}

    formatTime={formatTime}

    seekTo={seekTo}


/>
     <YouTubePlayer
    videoId={currentSong?.videoId}
    isPlaying={isPlaying}
    volume={volume}
    onReady={setPlayer}
    onEnd={handleSongEnd}
    seekTo={seekTo}
/>
    </div>

  );

}

export default App;