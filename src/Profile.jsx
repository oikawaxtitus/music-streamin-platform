
function Profile({ username, setUsername }) {

  // Displays the user's profile information.
  // setUsername updates the display name when the input changes.

  return (
    <main className="page">

      <div className="page-intro">

        <span className="eyebrow">
          MAKE IT YOURS
        </span>

        <h2>Your profile</h2>

        <p>
          A little space for your music identity.
        </p>

      </div>

      {/* PROFILE DETAILS */}
      <section className="profile-card">

        <div className="profile-avatar">
          {username
            ? username.charAt(0).toUpperCase()
            : "M"}
        </div>

        <div>
          <h3>{username || "Music listener"}</h3>

          <p className="muted">
            Your HitSpot profile
          </p>
        </div>

      </section>

      {/* DISPLAY NAME INPUT */}
      <div className="form-card">

        <label htmlFor="username">
          Display name
        </label>

        <input
          id="username"
          value={username}
          onChange={event =>
            setUsername(event.target.value)
          }
          placeholder="Enter your name"
        />

        <p className="muted">
          Your name is shown in your profile area.
        </p>

      </div>

    </main>
  );
}

export default Profile;
