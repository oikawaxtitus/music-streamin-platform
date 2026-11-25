
function SongCard({
  song,
  onPlay,
  onLike,
  playlists = [],
  onAdd
}) {

  // Adds the current song to a playlist selected by the user.
  // First checks whether playlists exist.
  // Then asks the user to enter a playlist name.
  // Finally, finds the matching playlist and adds the song.
  function addToPlaylist() {

    if (!playlists.length) {
      alert("Create a playlist first.");
      return;
    }

    const choice = prompt(
      "Enter the playlist name:\n" +
      playlists.map(item => item.name).join("\n")
    );

    const selected = playlists.find(
      item =>
        item.name.toLowerCase() ===
        (choice || "").trim().toLowerCase()
    );

    if (selected) {
      onAdd(song, selected.id);
    } else if (choice) {
      alert(
        "Playlist not found. Check the name and try again."
      );
    }
  }

  return (
    <article className="song-card">

      {/* SONG COVER IMAGE */}
      <div
        className="cover-art"
        style={
          song.image
            ? { backgroundImage: `url(${song.image})` }
            : {}
        }
      >

        {/* SHOWS THE FIRST LETTER IF THERE IS NO COVER IMAGE */}
        {!song.image && (
          <span>
            {song.name?.charAt(0).toUpperCase() || "♫"}
          </span>
        )}

        {/* PLAY BUTTON ON THE COVER */}
        <button
          className="cover-play"
          onClick={() => onPlay(song)}
          aria-label={`Play ${song.name}`}
        >
          ▶
        </button>

      </div>

      {/* SONG DETAILS */}
      <div className="song-info">

        <div className="song-title-row">

          <h3>{song.name}</h3>

          {/* LIKES THE CURRENT SONG */}
          <button
            className="icon-button like-button"
            onClick={() => onLike && onLike(song)}
            title="Like song"
          >
            ♡
          </button>

        </div>

        <p>{song.artist}</p>

        {/* ALBUM AND GENRE DETAILS */}
        <div className="song-meta">

          <span>{song.album}</span>
          <span>{song.genre}</span>

        </div>

        {/* SONG ACTION BUTTONS */}
        <div className="card-actions">

          <button
            className="button-primary"
            onClick={() => onPlay(song)}
          >
            Play track
          </button>

          <button
            className="button-quiet"
            onClick={addToPlaylist}
          >
            + Playlist
          </button>

        </div>

      </div>

    </article>
  );
}

export default SongCard;
