import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      username: formData.username.trim(),
      password: formData.password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/authenticate`,
        payload
      );

      console.log("Backend message:", response.data.message);

      if (response.data.status === "00") {
        // Save token
        localStorage.setItem("token", response.data.data);

        // Redirect to home (change if needed)
        navigate("/");
      } else {
        setError(response.data.message || "Login failed.");
      }

    } catch (err) {
      if (err.response) {
        console.log("Backend message:", err.response.data.message);
        setError(err.response.data.message || "Login failed.");
      } else {
        console.log("Unexpected error:", err.message);
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="../public/login.jpg"
          alt="Community"
        />
      </div>

      <div className="login-right">
        <div className="login-box">
          <h1 className="login-title">
            Login into <span>Neighbourly</span>
          </h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Phone or Email</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your phone or email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="login-footer">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
