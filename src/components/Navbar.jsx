import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./navbar.css";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8081/api/v1/user/profile-info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status === "00") {
          setUser(response.data.data);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;
    onSearch(keyword);
  };

  return (
    <div className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate("/")}>
  <span className="logo-short">N</span>
  <span className="logo-full">Neighbourly</span>
</div>
      </div>

      {/* Center */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Find Anything In Redemption City"
          className="search-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : user ? (
          <>
            <button
              className="register-business-btn"
              onClick={() => navigate("/register-business")}
            >
              Register Your Business
            </button>

            <div className="profile-menu">
              <img
                src={
                  user.profilePictureUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="profile-pic"
              />
              <div className="profile-dropdown">
                <p>
                  {user.firstName} {user.surname}
                </p>
                <button onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link">
              Login
            </Link>
            <Link to="/register" className="auth-link primary">
              Add Your Business
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;