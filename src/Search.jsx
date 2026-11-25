
import { useState } from "react";
import SongCard from "./SongCard";

function Search({
  songs,
  playSong,
  likeSong,
  playlists,
  addSongToPlaylist
}) {

  // Stores the text entered by the user in the search bar.
  const [searchText, setSearchText] = useState("");

  // Filters the songs based on the search text.
  // Searches through song name, artist, album and genre.
  // toLowerCase() makes the search case-insensitive.
  const results = songs.filter(song =>
    [
      song.name,
      song.artist,
      song.album,
      song.genre
    ].some(value =>
      (value || "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
  );

  return (
    <main className="page">

      <div className="page-intro">

        <span className="eyebrow">
          FIND YOUR NEXT FAVOURITE
        </span>

        <h2>Search music</h2>

        <p>
          Look up a track, artist, album or genre.
        </p>

      </div>

      {/* SEARCH INPUT */}
      <div className="search-box">

        <span>⌕</span>

        <input
          value={searchText}
          onChange={event =>
            setSearchText(event.target.value)
          }
          placeholder="What do you want to listen to?"
        />

      </div>

      {/* SEARCH RESULT HEADING */}
      <div className="section-heading">

        <h2>
          {searchText ? "Search results" : "All tracks"}
        </h2>

        <span className="muted">
          {results.length} found
        </span>

      </div>

      {/* DISPLAYS MATCHING SONGS */}
      <div className="song-container">

        {results.length ? (
          results.map(song => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={playSong}
              onLike={likeSong}
              playlists={playlists}
              onAdd={addSongToPlaylist}
            />
          ))
        ) : (
          <p className="empty-state">
            No tracks match your search. Try another keyword.
          </p>
        )}

      </div>

    </main>
  );
}

export default Search;
