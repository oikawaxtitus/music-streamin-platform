
import { useState } from "react";

function Playlists({
  playlists,
  createPlaylist,
  deletePlaylist,
  playSong,
  removeSongFromPlaylist
}) {

  // Stores the name entered in the create playlist input.
  const [playlistName, setPlaylistName] = useState("");

  // Stores messages such as playlist creation confirmation.
  const [message, setMessage] = useState("");

  // Calls the createPlaylist function from App.jsx.
  // Clears the input after attempting to create a playlist.
  function handleCreate() {
    setMessage(createPlaylist(playlistName));
    setPlaylistName("");
  }

  return (
    <main className="page">

      <div className="page-intro">

        <span className="eyebrow">
          CURATE YOUR SOUND
        </span>

        <h2>My playlists</h2>

        <p>
          Make collections for every mood and moment.
        </p>

      </div>

      {/* CREATE PLAYLIST SECTION */}
      <div className="create-playlist">

        <div>
          <h3>Create a playlist</h3>
          <p>Give your collection a name to get started.</p>
        </div>

        <div className="inline-form">

          <input
            value={playlistName}
            onChange={event =>
              setPlaylistName(event.target.value)
            }
            onKeyDown={event =>
              event.key === "Enter" && handleCreate()
            }
            placeholder="e.g. Late night vibes"
          />

          <button
            className="button-primary"
            onClick={handleCreate}
          >
            + Create
          </button>

        </div>

      </div>

      {/* SHOWS PLAYLIST CREATION MESSAGE */}
      {message && (
        <p className="form-message">{message}</p>
      )}

      {/* MESSAGE WHEN NO PLAYLISTS EXIST */}
      {playlists.length === 0 && (
        <p className="empty-state">
          Your playlists will appear here once you create one.
        </p>
      )}

      {/* DISPLAYS ALL CREATED PLAYLISTS */}
      <div className="playlist-grid">

        {playlists.map(list => (
          <section className="playlist-box" key={list.id}>

            <div className="playlist-top">

              <div className="playlist-symbol">♫</div>

              <div>
                <h3>{list.name}</h3>
                <p>{list.songs.length} tracks</p>
              </div>

              {/* DELETES THE SELECTED PLAYLIST */}
              <button
                className="button-quiet danger-text"
                onClick={() => deletePlaylist(list.id)}
              >
                Delete
              </button>

            </div>

            {/* MESSAGE WHEN THE PLAYLIST HAS NO SONGS */}
            {list.songs.length === 0 ? (
              <p className="muted playlist-empty">
                No tracks added yet.
              </p>
            ) : (
              /* DISPLAYS THE SONGS INSIDE THIS PLAYLIST */
              list.songs.map(song => (
                <div className="playlist-song" key={song.id}>

                  <span>
                    {song.name}
                    <small> · {song.artist}</small>
                  </span>

                  <div>

                    {/* PLAYS THE SELECTED PLAYLIST SONG */}
                    <button
                      className="button-quiet"
                      onClick={() => playSong(song)}
                    >
                      Play
                    </button>

                    {/* REMOVES THE SONG FROM THIS PLAYLIST */}
                    <button
                      className="button-quiet"
                      onClick={() =>
                        removeSongFromPlaylist(list.id, song)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>
              ))
            )}

          </section>
        ))}

      </div>

    </main>
  );
}

export default Playlists;
