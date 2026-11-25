import { useState } from "react";

function Creator({
  creatorSongs,
  uploadSong,
  updateCreatorSong,
  deleteCreatorSong,
  playSong,
  currentUser
}) {
  const [creatorName] = useState(currentUser?.username || "Creator");
  const [message, setMessage] = useState("");

  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  function handleLocalFile(event) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // This URL plays the selected computer file in this browser session.
    // For a permanent project URL, put the file in public/music and enter its path.
    const temporaryAudioUrl = URL.createObjectURL(selectedFile);
    setFile(temporaryAudioUrl);
    setSelectedFileName(selectedFile.name);
    setMessage("Audio selected. Add the track to your library.");
  }

  function handleUpload() {
    if (!songName.trim() || !artist.trim() || !album.trim()) {
      setMessage("Please complete the song title, artist and album fields.");
      return;
    }

    if (!file.trim()) {
      setMessage(
        "Choose an audio file or enter a path such as /music/song.mp3."
      );
      return;
    }

    uploadSong({
      name: songName.trim(),
      artist: artist.trim(),
      album: album.trim(),
      genre,
      image: image.trim(),
      file: file.trim()
    });

    setSongName("");
    setArtist("");
    setAlbum("");
    setGenre("Pop");
    setImage("");
    setFile("");
    setSelectedFileName("");

    const picker = document.getElementById("creator-audio-file");
    if (picker) picker.value = "";

    setMessage("Track added to your library.");
  }

  function editSong(song) {
    const name = prompt("Song title:", song.name);
    if (name === null || !name.trim()) return;

    const newArtist = prompt("Artist:", song.artist);
    if (newArtist === null) return;

    const newAlbum = prompt("Album:", song.album);
    if (newAlbum === null) return;

    const newFile = prompt(
      "Audio path (example: /music/song.mp3):",
      song.file || ""
    );
    if (newFile === null) return;

    updateCreatorSong(song, {
      ...song,
      name: name.trim(),
      artist: newArtist.trim(),
      album: newAlbum.trim(),
      file: newFile.trim()
    });
  }

  return (
    <main className="page">
      <div className="page-intro">
        <span className="eyebrow">FOR THE PEOPLE BEHIND THE MUSIC</span>
        <h2>Creator studio</h2>
        <p>Manage your creator profile and add tracks to the library.</p>
      </div>


          <div className="creator-welcome">
            <div>
              <span className="eyebrow">SIGNED IN AS</span>
              <h3>{creatorName}</h3>
            </div>
            <span className="creator-badge">Creator</span>
          </div>

          <section className="form-card">
            <h3>Add a new track</h3>

            <div className="form-grid">
              <div>
                <label>Song title</label>
                <input
                  value={songName}
                  onChange={e => setSongName(e.target.value)}
                  placeholder="Track name"
                />
              </div>

              <div>
                <label>Artist</label>
                <input
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  placeholder="Artist name"
                />
              </div>

              <div>
                <label>Album</label>
                <input
                  value={album}
                  onChange={e => setAlbum(e.target.value)}
                  placeholder="Album name"
                />
              </div>

              <div>
                <label>Genre</label>
                <select value={genre} onChange={e => setGenre(e.target.value)}>
                  <option>Pop</option>
                  <option>Rock</option>
                  <option>Hip-Hop</option>
                  <option>Classical</option>
                  <option>Electronic</option>
                  <option>Jazz</option>
                </select>
              </div>

              <div>
                <label>Cover image URL (optional)</label>
                <input
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label>Audio file path (permanent project file)</label>
                <input
                  value={file.startsWith("blob:") ? "" : file}
                  onChange={e => {
                    setFile(e.target.value);
                    setSelectedFileName("");
                  }}
                  placeholder="/music/song-name.mp3"
                />
                <small className="muted">
                  Put permanent files in public/music, then enter their path.
                </small>
              </div>

              <div className="audio-upload-field">
                <label htmlFor="creator-audio-file">
                  Or choose an audio file from your computer
                </label>
                <input
                  id="creator-audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleLocalFile}
                />
                {selectedFileName && (
                  <small className="muted">
                    Selected: {selectedFileName}
                  </small>
                )}
                <small className="muted">
                  Computer-picked files play in this browser session only.
                  To keep them after refresh, use the public/music path above.
                </small>
              </div>
            </div>

            <button className="button-primary" onClick={handleUpload}>
              + Add track
            </button>
          </section>

      {message && <p className="form-message">{message}</p>}

      <div className="section-heading">
        <h2>My uploaded tracks</h2>
        <span className="muted">{creatorSongs.length} tracks</span>
      </div>

      <div className="track-list">
        {creatorSongs.length === 0 && (
          <p className="empty-state">Your uploaded tracks will appear here.</p>
        )}

        {creatorSongs.map(song => (
          <div className="track-row" key={song.id}>
            <div className="track-thumb">♫</div>

            <div className="track-main">
              <strong>{song.name}</strong>
              <span>{song.artist} · {song.album}</span>
            </div>

            <span className="track-genre">{song.genre}</span>

            <button
              className="button-primary small-button"
              onClick={() => playSong(song)}
              disabled={!song.file}
              title={song.file ? "Play track" : "Add an audio source first"}
            >
              Play
            </button>

            <button className="button-quiet" onClick={() => editSong(song)}>
              Edit
            </button>

            <button
              className="button-quiet danger-text"
              onClick={() => deleteCreatorSong(song)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Creator;
