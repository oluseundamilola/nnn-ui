import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./businessInfo.css";

function BusinessInfo() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/business/get-business/${id}`
      );

      if (res.data.status === "00") {
        setBusiness(res.data.data);
      }
    } catch (err) {
      console.log("Failed to fetch business", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="business-loading">Loading business details...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div>
        <Navbar />
        <div className="business-loading">Business not found.</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="business-container">
        {/* Banner */}
        <div className="business-banner">
          <img
            src={business.flyerImg}
            alt={business.title}
            className="business-banner-img"
          />
          <div className="business-overlay">
            <h1>{business.title}</h1>
            <span className="business-category">
              {business.categoryName}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="business-content">
          {/* Profile + About */}
          <div className="business-left">
            <div className="business-profile">
              <img
                src={
                  business.userImg ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Owner"
              />
              <div>
                <h3>Business Owner</h3>
                <p>ID: {business.userId}</p>
              </div>
            </div>

            <div className="business-about">
              <h2>About</h2>
              <p>{business.about}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="business-right">
            <div className="info-card">
              <h3>Contact Information</h3>

              <div className="info-row">
                <span>📍 Address</span>
                <p>{business.address}</p>
              </div>

              <div className="info-row">
                <span>📞 Phone</span>
                <div className="info-action">
                  <a href={`tel:${business.businessPhone}`}>
                    {business.businessPhone}
                  </a>
                  <button
                    onClick={() =>
                      copyToClipboard(business.businessPhone)
                    }
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="info-row">
                <span>✉ Email</span>
                <div className="info-action">
                  <a href={`mailto:${business.businessEmail}`}>
                    {business.businessEmail}
                  </a>
                  <button
                    onClick={() =>
                      copyToClipboard(business.businessEmail)
                    }
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {business.featured === true && (
              <div className="featured-badge">
                ⭐ Featured Business
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessInfo;