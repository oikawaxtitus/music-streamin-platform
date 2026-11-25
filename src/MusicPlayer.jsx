
import { useEffect, useRef, useState } from "react";

function MusicPlayer({ currentSong, songs = [], playSong }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState("");
  const [shuffle, setShuffle] = useState(false);

  // Stores the previous song ID to avoid immediate repeats.
  const previousRandomSong = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError("");

    if (!currentSong || !currentSong.file) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setIsPlaying(false);
      return;
    }

    audio.src = currentSong.file;
    audio.load();

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        setError("Could not play this file. Check the audio path.");
      });

  }, [currentSong]);

  function togglePlay() {
    const audio = audioRef.current;

    if (!currentSong) {
      setError("Choose a track to start listening.");
      return;
    }

    if (!currentSong.file) {
      setError("Add this track's local audio path in App.jsx or Creator Studio.");
      return;
    }

    if (audio.paused) {
      audio.play()
        .then(() => setError(""))
        .catch(() => setError("Unable to play this audio file."));
    } else {
      audio.pause();
    }
  }

  // Picks a random song, avoiding the current song when possible.
  function getRandomSong() {
    if (!songs.length) return null;

    if (songs.length === 1) return songs[0];

    const availableSongs = songs.filter(
      song => song.id !== currentSong?.id
    );

    if (!availableSongs.length) return songs[0];

    let randomSong;

    do {
      randomSong =
        availableSongs[Math.floor(Math.random() * availableSongs.length)];
    } while (
      availableSongs.length > 1 &&
      randomSong.id === previousRandomSong.current
    );

    previousRandomSong.current = randomSong.id;

    return randomSong;
  }

  // Previous and Next controls.
  function changeSong(direction) {
    if (!songs.length) return;

    if (shuffle && direction === 1) {
      const randomSong = getRandomSong();

      if (randomSong) playSong(randomSong);
      return;
    }

    const index = songs.findIndex(
      song => song.id === currentSong?.id
    );

    const next =
      index < 0
        ? 0
        : (index + direction + songs.length) % songs.length;

    playSong(songs[next]);
  }

  function formatTime(value) {
    if (!Number.isFinite(value)) return "0:00";

    return `${Math.floor(value / 60)}:${String(
      Math.floor(value % 60)
    ).padStart(2, "0")}`;
  }

  function seek(event) {
    const value = Number(event.target.value);

    setProgress(value);

    if (audioRef.current && duration) {
      audioRef.current.currentTime = (value / 100) * duration;
    }
  }

  // Automatically selects the next song when playback ends.
  function handleSongEnd() {
    if (shuffle) {
      const randomSong = getRandomSong();

      if (randomSong) playSong(randomSong);
    } else {
      changeSong(1);
    }
  }

  return (
    <footer className="player-bar">

      {/* CURRENT SONG */}
      <div className="now-playing">
        <div
          className="player-cover"
          style={
            currentSong?.image
              ? { backgroundImage: `url("${currentSong.image}")` }
              : {}
          }
        >
          {!currentSong?.image && "♫"}
        </div>

        <div className="player-track">
          <strong>
            {currentSong?.name || "Nothing playing"}
          </strong>

          <span>
            {currentSong?.artist || "Choose a track from your library"}
          </span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="player-controls">

        <div className="control-buttons">

          {/* SHUFFLE */}
          <button
            className={`player-control shuffle-button ${
              shuffle ? "shuffle-active" : ""
            }`}
            onClick={() => setShuffle(prev => !prev)}
            aria-label={shuffle ? "Turn shuffle off" : "Turn shuffle on"}
            title={shuffle ? "Shuffle is ON" : "Shuffle is OFF"}
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 14 4 4-4 4" />
              <path d="M2 18h2.5a6 6 0 0 0 4.9-2.6l5.2-7.8A6 6 0 0 1 19.5 5H22" />
              <path d="m18 2 4 3-4 3" />
              <path d="M2 6h2.5a6 6 0 0 1 4.9 2.6" />
              <path d="m14.5 15.5 1 1.5a6 6 0 0 0 4 2H22" />
            </svg>
          </button>

          {/* PREVIOUS */}
          <button
            className="player-control"
            onClick={() => changeSong(-1)}
            aria-label="Previous track"
          >
            |◀
          </button>

          {/* PLAY / PAUSE */}
          <button
            className="play-button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          {/* NEXT */}
          <button
            className="player-control"
            onClick={() => changeSong(1)}
            aria-label="Next track"
          >
            ▶|
          </button>

        </div>

        {/* PROGRESS */}
        <div className="progress-line">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={seek}
            aria-label="Track progress"
          />

          <span>{formatTime(duration)}</span>
        </div>

      </div>

      {/* STATUS */}
      <div className="player-status">
        <span className={isPlaying ? "equalizer playing" : "equalizer"}>
          <i></i>
          <i></i>
          <i></i>
        </span>

        <span>
          {error || (shuffle ? "Shuffle ON" : isPlaying ? "Now playing" : "Ready")}
        </span>
      </div>

      {/* AUDIO */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}

        onTimeUpdate={event => {
          const audio = event.currentTarget;

          setCurrentTime(audio.currentTime);

          setProgress(
            audio.duration
              ? (audio.currentTime / audio.duration) * 100
              : 0
          );
        }}

        onLoadedMetadata={event => {
          setDuration(event.currentTarget.duration);
        }}

        onEnded={handleSongEnd}

        onError={() => {
          if (currentSong?.file) {
            setIsPlaying(false);
            setError("Audio file not found. Check its path.");
          }
        }}
      />
    </footer>
  );
}

export default MusicPlayer;
