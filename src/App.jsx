
import { useEffect, useState } from "react";

import Home from "./Home";
import Search from "./Search";
import Playlists from "./Playlists";
import Liked from "./Liked";
import Creator from "./Creator";
import Profile from "./Profile";
import MusicPlayer from "./MusicPlayer";

function MusicApp({ currentUser, users, creators, onLogout, onDeleteCreator, onDeleteUser }) {
  // Stores the currently selected page.
  const [page, setPage] = useState("home");

  // Stores all songs available in the application.
  // Add your local audio file paths here later.
  // Example: file: "/music/dreams.mp3"
  const [songs, setSongs] = useState(() => {
    const saved = localStorage.getItem("musicflow_songs");
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return [
    {
      id: 1,
      name: "LOVERS ROCK",
      artist: "TV GIRL",
      album: "Dream World",
      genre: "Pop",
      image: "/cover/loversrock.jpeg",
      file: "/music/lovers.mp3"
    },
    {
      id: 2,
      name: "lucky",
      artist: "Artist Two",
      album: "Midnight",
      genre: "Rock",
      image: "/cover/lucky.jpeg",
      file: "/music/text.mp3.mp3"
    },
    {
      id: 3,
      name: "M",
      artist: "Artist Three",
      album: "Power",
      genre: "Hip-Hop",
      image: "/cover/m.jpeg",
      file: "/music/energy.mp3"
    },
    {
      id: 4,
      name: "Peace",
      artist: "Artist Four",
      album: "Relax",
      genre: "Classical",
      image: "/cover/sins.jpeg",
      file: "/music/peace.mp3"
    }
    ];
  });

  // Stores all playlists created by the user.
  const [playlists, setPlaylists] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`musicflow_playlists_${currentUser.id}`)) || []; } catch { return []; }
  });

  // Stores songs liked by the user.
  const [likedSongs, setLikedSongs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`musicflow_liked_${currentUser.id}`)) || []; } catch { return []; }
  });

  // Stores the song currently selected for playback.
  const [currentSong, setCurrentSong] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`musicflow_recent_${currentUser.id}`)) || []; } catch { return []; }
  });
  const [playCounts, setPlayCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("musicflow_play_counts")) || {}; } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem("musicflow_songs", JSON.stringify(songs)); }, [songs]);
  useEffect(() => { localStorage.setItem(`musicflow_playlists_${currentUser.id}`, JSON.stringify(playlists)); }, [playlists, currentUser.id]);
  useEffect(() => { localStorage.setItem(`musicflow_liked_${currentUser.id}`, JSON.stringify(likedSongs)); }, [likedSongs, currentUser.id]);
  useEffect(() => { localStorage.setItem(`musicflow_recent_${currentUser.id}`, JSON.stringify(recentlyPlayed)); }, [recentlyPlayed, currentUser.id]);
  useEffect(() => { localStorage.setItem("musicflow_play_counts", JSON.stringify(playCounts)); }, [playCounts]);

  // Play a song and keep a short listening history for the Home page.
  function handlePlaySong(song) {
    if (!song) return;
    setCurrentSong(song);
    setPlayCounts(previous => ({ ...previous, [song.id]: (previous[song.id] || 0) + 1 }));
    setRecentlyPlayed(previous => [
      song,
      ...previous.filter(item => item.id !== song.id)
    ].slice(0, 8));
  }

  // Stores the user's display name.
  const [username, setUsername] = useState(currentUser.username);

  // Stores songs uploaded through Creator Studio.
  const [creatorSongs, setCreatorSongs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("musicflow_creator_songs")) || []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("musicflow_creator_songs", JSON.stringify(creatorSongs)); }, [creatorSongs]);

  // Adds a song to the liked songs list.
  // Checks the song ID first to prevent duplicate likes.
  function likeSong(song) {
    if (likedSongs.some(item => item.id === song.id)) {
      return;
    }

    setLikedSongs([...likedSongs, song]);
  }

  // Removes a song from the liked songs list.
  // filter() keeps every song except the selected one.
  function unlikeSong(song) {
    setLikedSongs(
      likedSongs.filter(item => item.id !== song.id)
    );
  }

  // Creates a new playlist using the name entered by the user.
  // Checks for empty names and duplicate playlist names.
  function createPlaylist(name) {
    const cleanName = name.trim();

    if (!cleanName) {
      return "Enter a playlist name.";
    }

    if (
      playlists.some(
        item => item.name.toLowerCase() === cleanName.toLowerCase()
      )
    ) {
      return "That playlist already exists.";
    }

    setPlaylists([
      ...playlists,
      {
        id: Date.now(),
        name: cleanName,
        songs: []
      }
    ]);

    return "Playlist created.";
  }

  // Adds a selected song to a particular playlist.
  // Checks that the song is not already present in that playlist.
  function addSongToPlaylist(song, playlistId) {
    setPlaylists(
      playlists.map(list =>
        list.id === playlistId &&
        !list.songs.some(item => item.id === song.id)
          ? {
              ...list,
              songs: [...list.songs, song]
            }
          : list
      )
    );
  }

  // Removes a selected song from a particular playlist.
  function removeSongFromPlaylist(playlistId, song) {
    setPlaylists(
      playlists.map(list =>
        list.id === playlistId
          ? {
              ...list,
              songs: list.songs.filter(
                item => item.id !== song.id
              )
            }
          : list
      )
    );
  }

  // Deletes a playlist using its unique ID.
  function deletePlaylist(playlistId) {
    setPlaylists(
      playlists.filter(list => list.id !== playlistId)
    );
  }

  // Adds a new song uploaded by a creator to the main library.
  // Date.now() gives the new song a unique ID.
  function uploadSong(song) {
    const newSong = {
      ...song,
      id: Date.now(),
      creatorId: currentUser.id,
      creatorName: currentUser.username,
      playCount: 0
    };

    setSongs([...songs, newSong]);
    setCreatorSongs([...creatorSongs, newSong]);
  }

  // Updates an existing creator song everywhere it appears.
  // This keeps the library, liked songs and playlists updated.
  function updateCreatorSong(oldSong, updatedSong) {
    setSongs(
      songs.map(song =>
        song.id === oldSong.id ? updatedSong : song
      )
    );

    setCreatorSongs(
      creatorSongs.map(song =>
        song.id === oldSong.id ? updatedSong : song
      )
    );

    setLikedSongs(
      likedSongs.map(song =>
        song.id === oldSong.id ? updatedSong : song
      )
    );

    setPlaylists(
      playlists.map(list => ({
        ...list,
        songs: list.songs.map(song =>
          song.id === oldSong.id ? updatedSong : song
        )
      }))
    );

    if (currentSong?.id === oldSong.id) {
      setCurrentSong(updatedSong);
    }
  }

  // Deletes a creator song from the entire application.
  // Also removes it from liked songs and playlists.
  function removeSongDataEverywhere(songIds) {
    const ids = new Set(songIds);
    setSongs(previous => previous.filter(song => !ids.has(song.id)));
    setCreatorSongs(previous => previous.filter(song => !ids.has(song.id)));
    setLikedSongs(previous => previous.filter(song => !ids.has(song.id)));
    setPlaylists(previous => previous.map(list => ({ ...list, songs: list.songs.filter(song => !ids.has(song.id)) })));
    setRecentlyPlayed(previous => previous.filter(song => !ids.has(song.id)));
    if (currentSong && ids.has(currentSong.id)) setCurrentSong(null);

    // Remove deleted tracks from every account's saved lists, not just the admin's.
    Object.keys(localStorage).forEach(key => {
      if (!key.startsWith("musicflow_playlists_") && !key.startsWith("musicflow_liked_") && !key.startsWith("musicflow_recent_")) return;
      try {
        const saved = JSON.parse(localStorage.getItem(key));
        const cleaned = key.startsWith("musicflow_playlists_")
          ? saved.map(list => ({ ...list, songs: (list.songs || []).filter(song => !ids.has(song.id)) }))
          : saved.filter(song => !ids.has(song.id));
        localStorage.setItem(key, JSON.stringify(cleaned));
      } catch { /* Ignore malformed old browser data. */ }
    });
  }

  function deleteCreatorSong(song) {
    removeSongDataEverywhere([song.id]);
  }

  function deleteCreatorAccount(creator) {
    const ownedIds = songs.filter(song => song.creatorId === creator.id).map(song => song.id);
    removeSongDataEverywhere(ownedIds);
    onDeleteCreator(creator.id);
  }

  if (currentUser.role === "admin") {
    return (
      <AdminDashboard
        songs={songs}
        users={users}
        creators={creators}
        playCounts={playCounts}
        playlistsCount={getAllPlaylistCount()}
        onDeleteSong={deleteCreatorSong}
        onDeleteCreator={deleteCreatorAccount}
        onDeleteUser={onDeleteUser}
        onLogout={onLogout}
      />
    );
  }

  // Contains the navigation buttons shown in the sidebar.
  const navItems = [
    ["home", "⌂", "Home"],
    ["search", "⌕", "Search"],
    ["playlist", "▤", "Playlists"],
    ["liked", "♡", "Liked Songs"],
    ["creator", "＋", "Creator Studio"],
    ["profile", "◎", "Profile"]
  ];

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <span className="brand-mark">♫</span>
          <span>
            hit<span className="brand-accent"></span>spot
          </span>
        </div>

        <p className="side-label">MENU</p>

        <nav className="side-nav">
          {navItems.map(([id, icon, label]) => (
            <button
              key={id}
              className={
                page === id ? "nav-link active" : "nav-link"
              }
              onClick={() => setPage(id)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-note">♫</div>
          <p className="side-quote">
            Music is the shortcut to the soul.
          </p>
          <span>YOUR SOUND. YOUR SPACE.</span>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="main-area">

        <header className="topbar">
          <div>
            <span className="eyebrow">
              YOUR PERSONAL MUSIC SPACE
            </span>
            <h1>Good music. Good mood.</h1>
          </div>

          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Ready to listen</span>

            <div className="avatar">{username ? username.charAt(0).toUpperCase() : "M"}</div>
            <button className="button-quiet auth-logout" onClick={onLogout}>Log out</button>
          </div>
        </header>

        {/* Displays the page selected in the sidebar. */}

        {page === "home" && (
          <Home
            songs={songs}
            playSong={handlePlaySong}
            likeSong={likeSong}
            playlists={playlists}
            addSongToPlaylist={addSongToPlaylist}
            likedSongs={likedSongs}
            creatorSongs={creatorSongs}
            recentlyPlayed={recentlyPlayed}
            setPage={setPage}
          />
        )}

        {page === "search" && (
          <Search
            songs={songs}
            playSong={handlePlaySong}
            likeSong={likeSong}
            playlists={playlists}
            addSongToPlaylist={addSongToPlaylist}
          />
        )}

        {page === "playlist" && (
          <Playlists
            playlists={playlists}
            createPlaylist={createPlaylist}
            deletePlaylist={deletePlaylist}
            playSong={handlePlaySong}
            removeSongFromPlaylist={removeSongFromPlaylist}
          />
        )}

        {page === "liked" && (
          <Liked
            songs={likedSongs}
            playSong={handlePlaySong}
            unlikeSong={unlikeSong}
          />
        )}

        {page === "creator" && (
          <Creator
            creatorSongs={creatorSongs.filter(song => song.creatorId === currentUser.id)}
            uploadSong={uploadSong}
            updateCreatorSong={updateCreatorSong}
            deleteCreatorSong={deleteCreatorSong}
            playSong={handlePlaySong}
            currentUser={currentUser}
          />
        )}

        {page === "profile" && (
          <Profile username={username} setUsername={setUsername} />
        )}

      </div>

      {/* Music player stays available across all pages. */}
      <MusicPlayer
        currentSong={currentSong}
        songs={songs}
        playSong={handlePlaySong}
      />

    </div>
  );
}


const ADMIN_PASSWORD = "Admin@123";

function readStored(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function getAllPlaylistCount() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("musicflow_playlists_")) count += readStored(key, []).length;
  }
  return count;
}

function AuthScreen({ onLogin, users, setUsers, creators, setCreators }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    const cleanName = username.trim();
    if (!cleanName || !password) return setMessage("Enter your username and password.");

    if (mode === "login") {
      if (cleanName.toLowerCase() === "admin" && password === ADMIN_PASSWORD) {
        onLogin({ id: "admin", username: "Admin", role: "admin" });
        return;
      }
      const found = users.find(user => user.username.toLowerCase() === cleanName.toLowerCase() && user.password === password);
      if (!found) return setMessage("Incorrect username or password.");
      onLogin(found);
      return;
    }

    if (users.some(user => user.username.toLowerCase() === cleanName.toLowerCase())) {
      return setMessage("That username is already taken.");
    }
    const account = { id: `${role}_${Date.now()}`, username: cleanName, password, role, createdAt: new Date().toISOString() };
    const nextUsers = [...users, account];
    setUsers(nextUsers);
    localStorage.setItem("musicflow_users", JSON.stringify(nextUsers));
    if (role === "creator") {
      const nextCreators = [...creators, { id: account.id, username: cleanName, createdAt: account.createdAt }];
      setCreators(nextCreators);
      localStorage.setItem("musicflow_creators", JSON.stringify(nextCreators));
    }
    onLogin(account);
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand"><span>♫</span> hit<span>spot</span></div>
        <p className="eyebrow">YOUR PERSONAL MUSIC SPACE</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="muted">{mode === "login" ? "Sign in and get back to your music." : "Join MusicFlow as a listener or creator."}</p>
        {mode === "register" && <>
          <label>Account type</label>
          <select value={role} onChange={event => setRole(event.target.value)}>
            <option value="user">Listener / User</option>
            <option value="creator">Music Creator</option>
          </select>
        </>}
        <label>Username</label>
        <input value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter username" autoComplete="username" />
        <label>Password</label>
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {message && <p className="form-message">{message}</p>}
        <button className="button-primary auth-submit" type="submit">{mode === "login" ? "Login" : "Create account"}</button>
        <p className="auth-switch">{mode === "login" ? "New to MusicFlow?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>{mode === "login" ? "Register" : "Login"}</button></p>
        <p className="auth-admin-hint">Admin demo: username <b>admin</b> · password <b>Admin@123</b></p>
      </form>
    </div>
  );
}

function AdminDashboard({ songs, users, creators, playCounts, playlistsCount, onDeleteSong, onDeleteCreator, onDeleteUser, onLogout }) {
  const topSongs = [...songs].sort((a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0)).slice(0, 5);
  const creatorPopularity = creators.map(creator => ({ ...creator, plays: songs.filter(song => song.creatorId === creator.id).reduce((sum, song) => sum + (playCounts[song.id] || 0), 0), tracks: songs.filter(song => song.creatorId === creator.id).length })).sort((a, b) => b.plays - a.plays);
  return (
    <div className="admin-shell">
      <header className="admin-topbar"><div className="admin-brand">♫ hit<span>spot</span> <small>ADMIN</small></div><button className="button-secondary" onClick={onLogout}>Log out</button></header>
      <main className="admin-content">
        <div className="page-intro"><span className="eyebrow">MUSICFLOW CONTROL CENTER</span><h2>Admin dashboard</h2><p>Manage accounts, creators and the music library.</p></div>
        <div className="admin-stats">
          <div className="admin-stat"><span>Registered users</span><strong>{users.filter(user => user.role === "user").length}</strong></div>
          <div className="admin-stat"><span>Creators</span><strong>{creators.length}</strong></div>
          <div className="admin-stat"><span>Total songs</span><strong>{songs.length}</strong></div>
          <div className="admin-stat"><span>Playlists</span><strong>{playlistsCount}</strong></div>
        </div>
        <section className="admin-panel"><div className="section-heading"><h2>Music analytics</h2><span className="muted">Based on plays in this browser</span></div>
          <div className="admin-analytics-grid"><div><h3>Most played songs</h3>{topSongs.length ? topSongs.map(song => <div className="admin-list-row" key={song.id}><span>{song.name}<small>{song.artist}</small></span><b>{playCounts[song.id] || 0} plays</b></div>) : <p className="muted">No plays recorded yet.</p>}</div><div><h3>Popular creators</h3>{creatorPopularity.length ? creatorPopularity.map(creator => <div className="admin-list-row" key={creator.id}><span>{creator.username}<small>{creator.tracks} tracks</small></span><b>{creator.plays} plays</b></div>) : <p className="muted">No creator accounts yet.</p>}</div></div>
        </section>
        <section className="admin-panel"><div className="section-heading"><h2>Manage songs</h2><span className="muted">{songs.length} total</span></div>{songs.map(song => <div className="admin-list-row" key={song.id}><span>{song.name}<small>{song.artist} · {song.creatorName || "MusicFlow library"}</small></span><button className="button-quiet danger-text" onClick={() => { if (window.confirm(`Delete “${song.name}”?`)) onDeleteSong(song); }}>Delete song</button></div>)}</section>
        <section className="admin-panel"><div className="section-heading"><h2>Manage creators</h2><span className="muted">{creators.length} accounts</span></div>{creators.length ? creators.map(creator => <div className="admin-list-row" key={creator.id}><span>{creator.username}<small>{songs.filter(song => song.creatorId === creator.id).length} uploaded songs</small></span><button className="button-quiet danger-text" onClick={() => { if (window.confirm(`Delete creator “${creator.username}” and all their uploaded songs?`)) onDeleteCreator(creator); }}>Delete creator</button></div>) : <p className="muted">No creator accounts registered.</p>}</section>
        <section className="admin-panel"><div className="section-heading"><h2>Registered users</h2><span className="muted">{users.filter(user => user.role === "user").length} users</span></div>{users.filter(user => user.role === "user").map(user => <div className="admin-list-row" key={user.id}><span>{user.username}<small>Joined {new Date(user.createdAt).toLocaleDateString()}</small></span><button className="button-quiet danger-text" onClick={() => { if (window.confirm(`Delete user “${user.username}”?`)) onDeleteUser(user.id); }}>Delete user</button></div>)}</section>
        <p className="admin-disclaimer">Demo note: accounts, songs, playlists and analytics are stored in this browser’s localStorage. This is not secure production authentication.</p>
      </main>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState(() => readStored("musicflow_users", []));
  const [creators, setCreators] = useState(() => readStored("musicflow_creators", []));
  const [currentUser, setCurrentUser] = useState(() => readStored("musicflow_session", null));

  useEffect(() => { localStorage.setItem("musicflow_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("musicflow_creators", JSON.stringify(creators)); }, [creators]);

  function login(account) {
    setCurrentUser(account);
    localStorage.setItem("musicflow_session", JSON.stringify(account));
  }
  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("musicflow_session");
  }
  function deleteCreator(creatorId) {
    const nextCreators = creators.filter(item => item.id !== creatorId);
    const nextUsers = users.filter(item => item.id !== creatorId);
    setCreators(nextCreators); setUsers(nextUsers);
    localStorage.setItem("musicflow_creators", JSON.stringify(nextCreators));
    localStorage.setItem("musicflow_users", JSON.stringify(nextUsers));
    // Remove all personal data belonging to the deleted creator account.
    localStorage.removeItem(`musicflow_playlists_${creatorId}`);
    localStorage.removeItem(`musicflow_liked_${creatorId}`);
    localStorage.removeItem(`musicflow_recent_${creatorId}`);
  }
  function deleteUser(userId) {
    const nextUsers = users.filter(item => item.id !== userId);
    setUsers(nextUsers); localStorage.setItem("musicflow_users", JSON.stringify(nextUsers));
    localStorage.removeItem(`musicflow_playlists_${userId}`);
    localStorage.removeItem(`musicflow_liked_${userId}`);
    localStorage.removeItem(`musicflow_recent_${userId}`);
  }

  if (!currentUser) return <AuthScreen onLogin={login} users={users} setUsers={setUsers} creators={creators} setCreators={setCreators} />;
  return <MusicApp key={currentUser.id} currentUser={currentUser} users={users} creators={creators} onLogout={logout} onDeleteCreator={deleteCreator} onDeleteUser={deleteUser} />;
}

export default App;
