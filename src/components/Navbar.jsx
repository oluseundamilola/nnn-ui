import "./navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <div className="logo">N</div>
      </div>

      {/* Middle */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search businesses..."
          className="search-input"
        />
        <button className="search-btn">Search</button>
      </div>

      {/* Right */}
      <div className="navbar-right">
        <img
          src="https://randomuser.me/api/portraits/men/45.jpg"
          alt="profile"
          className="profile-pic"
        />
      </div>
    </div>
  );
}

export default Navbar;
