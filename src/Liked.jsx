
function Liked({ songs, playSong, unlikeSong }) {

  // Displays the liked songs list.
  // The user can play a song or remove it from this list.

  return (
    <main className="page">

      <div className="page-intro">

        <span className="eyebrow">
          SAVED FOR YOU
        </span>

        <h2>Liked songs</h2>

        <p>
          Your personal collection of tracks worth keeping.
        </p>

      </div>

      <div className="track-list">

        {/* MESSAGE WHEN THERE ARE NO LIKED SONGS */}
        {songs.length === 0 && (
          <p className="empty-state">
            No liked songs yet. Tap the heart on any track
            to save it here.
          </p>
        )}

        {/* DISPLAYS EACH LIKED SONG */}
        {songs.map(song => (
          <div className="track-row" key={song.id}>

            <div className="track-thumb">♫</div>

            <div className="track-main">
              <strong>{song.name}</strong>

              <span>
                {song.artist} · {song.album}
              </span>
            </div>

            <span className="track-genre">
              {song.genre}
            </span>

            {/* PLAYS THE SELECTED SONG */}
            <button
              className="button-primary small-button"
              onClick={() => playSong(song)}
            >
              Play
            </button>

            {/* REMOVES THE SONG FROM LIKED SONGS */}
            <button
              className="button-quiet"
              onClick={() => unlikeSong(song)}
            >
              Remove
            </button>

          </div>
        ))}

      </div>

    </main>
  );
}

export default Liked;
