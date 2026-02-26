import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "profilePicture") {
    const file = files[0];

    if (!file) return;

    // ✅ FILE SIZE VALIDATION (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile picture must be less than 2MB.");
      return;
    }

    setError(""); // clear previous errors
    setFormData({ ...formData, profilePicture: file });
    setPreview(URL.createObjectURL(file));

  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("firstName", formData.firstName.trim());
      data.append("surname", formData.surname.trim());
      data.append("phone", formData.phone.trim());
      data.append("password", formData.password);
      // ✅ Only append email if it exists
if (formData.email.trim() !== "") {
  data.append("email", formData.email.trim());
}

      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }

      const response = await axios.post(
        "http://localhost:8081/api/v1/user/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend message:", response.data.message);

      if (response.data.status === "00") {
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed.");
      }

    } catch (err) {
      if (err.response) {
        console.log("Backend message:", err.response.data.message);
        setError(err.response.data.message || "Registration failed.");
      } else {
        console.log("Unexpected error:", err.message);
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src= "../public/reg.jpg"
          alt="Community"
        />
      </div>

      <div className="register-right">
        <div className="register-box">
          <h1 className="register-title">
            Create your <span>Neighbourly </span> account
          </h1>

          <form className="register-form" onSubmit={handleSubmit}>

            {/* PROFILE PREVIEW */}
            <div className="profile-preview">
              <label htmlFor="profilePicture">
                <img
                  src={
                    preview ||
                    "../public/p.png"
                  }
                  alt="Profile Preview"
                />
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </div>

            {/* FIRST + SURNAME */}
            <div className="double-input">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE + EMAIL */}
            <div className="double-input">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email (Optional)"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORDS */}
            <div className="double-input">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
