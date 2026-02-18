import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
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

  // Build payload properly
  const payload = {
    phone: formData.phone.trim(),
    password: formData.password,
    email:
      formData.email.trim() === "" ? null : formData.email.trim(),
  };

  try {
    const response = await axios.post(
      "http://localhost:8081/api/v1/user/register",
      payload
    );

    // Always log backend message
    console.log("Backend message:", response.data.message);

    if (response.data.status === "00") {
      navigate("/login");
    } else {
      setError(response.data.message || "An error occurred.");
    }

  } catch (err) {
    if (err.response) {
      // Backend responded with error (400, 500 etc)
      console.log("Backend message:", err.response.data.message);
      setError(err.response.data.message || "An error occurred.");
    } else {
      console.log("Unexpected error:", err.message);
      setError("An error occurred. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src="https://i.pinimg.com/1200x/12/e5/40/12e54081d8427e0d93c89da23ba2d58f.jpg"
          alt="Community"
        />
      </div>

      <div className="register-right">
        <div className="register-box">
          <h1 className="register-title">
            Create your <span>Neighbourlly</span> account
          </h1>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                minLength={11}
                required
              />
            </div>

            <div className="input-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email (optional)"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 8 characters)"
                minLength={8}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
