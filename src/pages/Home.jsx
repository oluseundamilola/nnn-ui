import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CategoryTabs from "../components/CategoryTabs";
import Card from "../components/Card";
import "./home.css";

function Home() {
  const token = localStorage.getItem("token");

  const [userBusinesses, setUserBusinesses] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  // Fetch user businesses only if token exists
  useEffect(() => {
    if (!token) return; // Don't fetch if not logged in

    axios
      .get("http://localhost:8081/api/v1/business/user-businesses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === "00") {
          setUserBusinesses(res.data.data);
        }
      })
      .catch((err) => console.log("User business fetch failed", err));
  }, [token]);

  // Fetch all businesses for current page
  const fetchAllBusinesses = async (pageNumber) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8081/api/v1/business/all-businesses?page=${pageNumber}`,
        {
          headers: { },
        }
      );

      if (res.data.status === "00") {
        const newBusinesses = res.data.data.data;
        console.log(newBusinesses)

        // Remove duplicates (in case user business appears in all list)
      

        setAllBusinesses((prev) => {
  // Get IDs of user's businesses
  const userBusinessIds = userBusinesses.map((b) => b.id);

  // Remove businesses that:
  // 1. Already exist in previous state
  // 2. Exist in user's business list
  const filteredBusinesses = newBusinesses.filter(
    (newBiz) =>
      !prev.some((existing) => existing.id === newBiz.id) &&
      !userBusinessIds.includes(newBiz.id)
  );

  return [...prev, ...filteredBusinesses];
});

        if (pageNumber + 1 >= res.data.data.totalPages) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.log("All business fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load for page 0
  useEffect(() => {
    fetchAllBusinesses(0);
  }, []);

  // Infinite scroll observer
  const observerCallback = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Trigger load when page changes
  useEffect(() => {
    if (page === 0) return; // Initial load is handled above
    fetchAllBusinesses(page);
  }, [page]);

  return (
    <div>
      <Navbar />
      <CategoryTabs />

      <div className="home-container">

        {/* FEATURED SECTION (Static data) */}
        <div className="featured-section">
          <h2 className="section-title">⭐ Featured Businesses</h2>
          <div className="featured-scroll">
            {[
              {
                id: 1,
                title: "Tech Solutions Ltd",
                owner: "John Doe",
                category: "Tech",
                image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
                profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                id: 2,
                title: "Delicious Bites",
                owner: "Mary Johnson",
                category: "Food",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                id: 3,
                title: "Home Repair Pro",
                owner: "David Smith",
                category: "Home Service",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                profileImage: "https://randomuser.me/api/portraits/men/12.jpg",
              },
              {
                id: 4,
                title: "Fashion Hub",
                owner: "Lisa Brown",
                category: "Fashion",
                image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
                profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
              },
            ].map((business) => (
              <div className="featured-card-wrapper" key={business.id}>
                <Card
                  variant="large"
                  image={business.image}
                  profileImage={business.profileImage}
                  title={business.title}
                  owner={business.owner}
                  category={business.category}
                />
              </div>
            ))}
          </div>
        </div>

        {/* USER BUSINESSES SECTION (only if logged in and they have businesses) */}
        {userBusinesses.length > 0 && (
          <div className="normal-section">
            <h2 className="section-title">Your Businesses</h2>
            <div className="normal-grid">
              {userBusinesses.map((business) => (
                <Card
                  key={business.id}
                  image={business.flyerImg}
                  title={business.title}
                  owner="You"
                  category={business.categoryName}
                  profileImage={
                    business.profilePictureUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* ALL BUSINESSES SECTION */}
        <div className="normal-section">
          <h2 className="section-title">All Businesses</h2>
          <div className="normal-grid">
            {allBusinesses.map((business, index) => {
              if (index === allBusinesses.length - 1) {
                return (
                  <div ref={observerCallback} key={business.id}>
                    <Card
                      image={business.flyerImg}
                      title={business.title}
                      owner="Business Owner"
                      category={business.categoryName}
                      profileImage={
  business.userImg 
    ? business.userImg 
    : "https://res.cloudinary.com/datnaqyl0/image/upload/v1771587215/mqjcuybfmqipqujxqqpp.jpg"
}
                    />
                  </div>
                );
              }
              return (
                <Card
                  key={business.id}
                  image={business.flyerImg}
                  title={business.title}
                  owner="Business Owner"
                  category={business.categoryName}
                  profileImage={
                    business.profilePictureUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                />
              );
            })}
          </div>

          {loading && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Loading more businesses...
            </p>
          )}

          {!hasMore && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No more businesses
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;