import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import "./registerBusiness.css";

function RegisterBusiness() {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  const [previewFlyer, setPreviewFlyer] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Submit Business");

  const [formData, setFormData] = useState({
    title: "",
    about: "",
    address: "",
    businessPhone: "",
    businessEmail: "",
    category: "",
    flyerImage: null,
  });

  /* ==============================
     FETCH PROFILE INFO
  ============================== */
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/v1/user/profile-info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === "00") {
          setUser(res.data.data);
        }
      })
      .catch((err) => console.error("Profile fetch failed", err));
  }, [token]);

  /* ==============================
     FETCH CATEGORIES
  ============================== */
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/v1/business/get-category")
      .then((res) => {
        if (res.data.status === "00") {
          setCategories(res.data.data);
        }
      });
  }, []);

  /* ==============================
     HANDLE INPUT CHANGE
  ============================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "flyerImage") {
      const file = files[0];
      setFormData({ ...formData, flyerImage: file });
      setPreviewFlyer(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ==============================
     PROFILE IMAGE SELECT
  ============================== */
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);
    setPreviewProfile(URL.createObjectURL(file));
  };

  /* ==============================
     SUBMIT
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setButtonText("Working on things...");

      /* ==============================
         1️⃣ UPLOAD PROFILE PIC (IF SELECTED)
         Ignore if status = "99"
      ============================== */
      if (profileFile) {
        const profileData = new FormData();
        profileData.append("file", profileFile);

        try {
          const uploadRes = await axios.post(
            "http://localhost:8081/api/v1/user/upload",
            profileData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadRes.data.status !== "00") {
            console.log("Profile upload failed:", uploadRes.data.message);
            // IGNORE failure and continue
          }
        } catch (err) {
          console.log("Profile upload error:", err);
          // IGNORE error and continue
        }
      }

      /* ==============================
         2️⃣ REGISTER BUSINESS
      ============================== */
      const businessData = new FormData();
      businessData.append("title", formData.title);
      businessData.append("about", formData.about);
      businessData.append("address", formData.address);
      businessData.append("businessPhone", formData.businessPhone);
      businessData.append("businessEmail", formData.businessEmail);
      businessData.append("category", formData.category);
      businessData.append("flyerImage", formData.flyerImage);

      const res = await axios.post(
        "http://localhost:8081/api/v1/business/register-business",
        businessData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status !== "00") {
        console.log(res.data.message);
        alert("Please try again later");
        setLoading(false);
        setButtonText("Submit Business");
        return;
      }

      /* ==============================
         ✅ SUCCESS
      ============================== */
      setButtonText("Success!");

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    } catch (error) {
      console.log(error);
      alert("Please try again later");
      setLoading(false);
      setButtonText("Submit Business");
    }
  };

  return (
    <div className="register-business-container">

      {/* LEFT SIDE - PREVIEW */}
      <div className="preview-section">
        <Card
          image={
            previewFlyer ||
            "https://via.placeholder.com/400x250?text=Flyer+Preview"
          }
          title={formData.title || "Business Title"}
          owner={
            user
              ? `${user.firstName} ${user.surname}`
              : "Owner Name"
          }
          category={
            categories.find((c) => c.id == formData.category)?.category ||
            "Category"
          }
          profileImage={
            previewProfile ||
            user?.profilePictureUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          variant="large"
        />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="form-section">
        <div className="form-box">
          <h2>Register Your Business</h2>

          {/* PROFILE UPLOAD IF NULL */}
          {user && !user.profilePictureUrl && (
            <div className="profile-upload-box">
              <p>Upload profile picture</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
              />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Business Title"
              onChange={handleChange}
              required
            />

            <textarea
              name="about"
              placeholder="About your business"
              rows="4"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Business Address"
              onChange={handleChange}
            />

            <input
              type="text"
              name="businessPhone"
              placeholder="Business Phone"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="businessEmail"
              placeholder="Business Email"
              onChange={handleChange}
            />

            <select
              name="category"
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>

            <input
              type="file"
              name="flyerImage"
              accept="image/*"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterBusiness;