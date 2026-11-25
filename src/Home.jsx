
import { useState } from "react";

function Home({
  songs = [],
  playSong,
  likeSong,
  addSongToPlaylist,
  playlists = [],
  likedSongs = [],
  creatorSongs = [],
  recentlyPlayed = [],
  setPage
}) {
  const [activeTab, setActiveTab] = useState("music");

  const mySongs = [
    ...new Map(
      [...creatorSongs, ...likedSongs].map(song => [song.id, song])
    ).values()
  ];

  function SongCard({ song }) {
    const isLiked = likedSongs.some(item => item.id === song.id);

    function handleAddToPlaylist() {
      if (!playlists.length) {
        alert("Create a playlist first!");
        setPage?.("playlist");
        return;
      }

      const choice = prompt(
        "Enter the playlist name:\n\n" +
        playlists.map(p => p.name).join("\n")
      );

      if (!choice) return;

      const selected = playlists.find(
        p => p.name?.toLowerCase() === choice.trim().toLowerCase()
      );

      if (!selected) {
        alert("Playlist not found! Please enter the exact playlist name.");
        return;
      }

      if (!addSongToPlaylist) {
        alert("Playlist function is not connected. Check App.jsx.");
        return;
      }

      addSongToPlaylist(song, selected.id);
      alert(`"${song.name}" added to "${selected.name}"!`);
    }

    return (
      <article className="spotify-song-card">
        <div
          className={`spotify-cover${song.image ? " has-image" : ""}`}
          style={
            song.image
              ? { backgroundImage: `url("${song.image}")` }
              : {}
          }
        >
          {!song.image && (
            <span>
              {song.name?.charAt(0)?.toUpperCase() || "♫"}
            </span>
          )}

          <button
            className="spotify-card-play"
            onClick={() => playSong?.(song)}
            aria-label={`Play ${song.name}`}
          >
            ▶
          </button>
        </div>

        <div className="spotify-card-details">
          <div className="spotify-card-title-row">
            <h3 title={song.name}>{song.name}</h3>

            <button
              className={`spotify-like${isLiked ? " liked" : ""}`}
              onClick={() => likeSong?.(song)}
              aria-label={isLiked ? `Liked ${song.name}` : `Like ${song.name}`}
              title={isLiked ? "Liked" : "Like song"}
            >
              {isLiked ? "♥" : "♡"}
            </button>
          </div>

          <p>{song.artist || "Unknown artist"}</p>

          <div className="spotify-card-bottom">
            <span>
              {song.album || song.genre || "MusicFlow library"}
            </span>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => playSong?.(song)}>
                Play track
              </button>

              <button onClick={handleAddToPlaylist}>
                + Playlist
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="page spotify-home">
      <div className="spotify-tabs" aria-label="Home sections">
        <button
          className={activeTab === "music" ? "active" : ""}
          onClick={() => setActiveTab("music")}
        >
          Music
        </button>

        <button
          className={activeTab === "playlists" ? "active" : ""}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists
        </button>

        <button
          className={activeTab === "mysongs" ? "active" : ""}
          onClick={() => setActiveTab("mysongs")}
        >
          My Songs
        </button>
      </div>

      {activeTab === "music" && (
        <>
          <section className="spotify-welcome">
            <div className="spotify-welcome-copy">
              <span className="spotify-welcome-pill">
                WELCOME TO HITSPOT
              </span>

              <h2>
                Every track has<br />
                <em>a feeling.</em>
              </h2>

              <p>
                Find your rhythm, revisit your favourites and discover
                your next repeat-worthy song.
              </p>
            </div>

            <div className="spotify-vinyl" aria-hidden="true">
              <div className="spotify-vinyl-disc">
                <span>♫</span>
              </div>
            </div>
          </section>

          <section className="spotify-section">
            <div className="spotify-section-heading">
              <div>
                <span className="spotify-eyebrow">YOUR LIBRARY</span>
                <h2>Popular tracks</h2>
              </div>

              <span className="spotify-track-count">
                {songs.length} tracks
              </span>
            </div>

            {songs.length ? (
              <div className="spotify-song-grid">
                {songs.map(song => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="spotify-empty">
                <p>No music in your library yet.</p>
                <button onClick={() => setPage?.("creator")}>
                  Upload your first track
                </button>
              </div>
            )}
          </section>

          <section className="spotify-section spotify-recent-section">
            <div className="spotify-section-heading">
              <div>
                <span className="spotify-eyebrow">
                  YOUR LISTENING HISTORY
                </span>
                <h2>Recently played</h2>
              </div>
            </div>

            {recentlyPlayed.length ? (
              <div className="spotify-song-grid">
                {recentlyPlayed.slice(0, 4).map(song => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="spotify-empty spotify-empty-compact">
                <p>Your recently played songs will appear here.</p>
                <span>Play a track to get started.</span>
              </div>
            )}
          </section>

          <section className="spotify-section">
            <div className="spotify-section-heading">
              <div>
                <span className="spotify-eyebrow">MADE BY YOU</span>
                <h2>Your playlists</h2>
              </div>

              <button onClick={() => setPage?.("playlist")}>
                See all
              </button>
            </div>

            {playlists.length ? (
              <div className="spotify-quick-grid">
                {playlists.slice(0, 4).map((playlist, index) => (
                  <button
                    className="spotify-quick-item"
                    key={playlist.id}
                    onClick={() => setPage?.("playlist")}
                  >
                    <span className={`spotify-quick-icon tone-${index % 4}`}>
                      {["♫", "▤", "♪", "♬"][index % 4]}
                    </span>

                    <span className="spotify-quick-copy">
                      <strong>{playlist.name}</strong>
                      <small>{playlist.songs?.length || 0} songs</small>
                    </span>

                    <span className="spotify-quick-play">▶</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="spotify-empty spotify-empty-inline">
                <p>You haven't created any playlists yet.</p>
                <button onClick={() => setPage?.("playlist")}>
                  Create a playlist
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "playlists" && (
        <section className="spotify-section spotify-tab-page">
          <span className="spotify-eyebrow">
            YOUR PERSONAL COLLECTION
          </span>

          <div className="spotify-section-heading">
            <h2>Your playlists</h2>
            <button onClick={() => setPage?.("playlist")}>
              Manage playlists
            </button>
          </div>

          {playlists.length ? (
            <div className="spotify-quick-grid spotify-playlist-list">
              {playlists.map((playlist, index) => (
                <button
                  className="spotify-quick-item"
                  key={playlist.id}
                  onClick={() => setPage?.("playlist")}
                >
                  <span className={`spotify-quick-icon tone-${index % 4}`}>
                    ♫
                  </span>

                  <span className="spotify-quick-copy">
                    <strong>{playlist.name}</strong>
                    <small>{playlist.songs?.length || 0} songs</small>
                  </span>

                  <span className="spotify-quick-play">▶</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="spotify-empty">
              <p>No playlists created yet.</p>
              <button onClick={() => setPage?.("playlist")}>
                Create your first playlist
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === "mysongs" && (
        <section className="spotify-section spotify-tab-page">
          <span className="spotify-eyebrow">
            YOUR PERSONAL COLLECTION
          </span>

          <div className="spotify-section-heading">
            <h2>My Songs</h2>
            <button onClick={() => setPage?.("creator")}>
              Upload music
            </button>
          </div>

          <p className="spotify-description">
            Songs you've uploaded and tracks you've liked.
          </p>

          {mySongs.length ? (
            <div className="spotify-song-grid">
              {mySongs.map(song => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="spotify-empty">
              <p>Your collection is empty.</p>
              <button onClick={() => setPage?.("creator")}>
                Upload your first song
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Home;
