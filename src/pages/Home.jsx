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
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]); // ✅ NEW
  const [searchResults, setSearchResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  /* ============================= */
  /* SEARCH FUNCTION */
  /* ============================= */
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/business/search-businesses?keyword=${keyword}&category=false&page=0`
      );

      if (res.data.status === "00") {
        setSearchResults(res.data.data.data);
        setIsSearching(true);
        setActiveCategory("All");
      }
    } catch (err) {
      console.log("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  /* ============================= */
  /* CATEGORY FUNCTION */
  /* ============================= */
  const handleCategoryChange = async (category) => {
    setActiveCategory(category);
    setIsSearching(false);

    if (category === "All") {
      setCategoryResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/business/search-businesses?keyword=${category}&category=true`
      );
      if (res.data.status === "00") {
        setCategoryResults(res.data.data.data);
      }
    } catch (err) {
      console.log("Category fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* USER BUSINESSES */
  /* ============================= */
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/business/user-businesses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === "00") {
          setUserBusinesses(res.data.data);
        }
      })
      .catch((err) => console.log("User business fetch failed", err));
  }, [token]);

  /* ============================= */
  /* ALL BUSINESSES + FEATURED */
  /* ============================= */
  const fetchAllBusinesses = async (pageNumber) => {
    if (loading || isSearching || activeCategory !== "All") return;

    try {
      setLoading(true);
      const res = await axios.get(
  `${import.meta.env.VITE_API_BASE_URL}/business/all-businesses?page=${pageNumber}`
);

      if (res.data.status === "00") {
        const newBusinesses = res.data.data.data;

        // ✅ Extract featured businesses
        const featured = newBusinesses.filter((b) => b.featured === true);
        setFeaturedBusinesses((prev) => {
          const unique = featured.filter(
            (b) => !prev.some((existing) => existing.id === b.id)
          );
          return [...prev, ...unique];
        });

        // Normal business logic
        setAllBusinesses((prev) => {
          const userBusinessIds = userBusinesses.map((b) => b.id);
          const filteredBusinesses = newBusinesses.filter(
            (b) =>
              !prev.some((existing) => existing.id === b.id) &&
              !userBusinessIds.includes(b.id)
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

  useEffect(() => {
    fetchAllBusinesses(0);
  }, []);

  const observerCallback = useCallback(
    (node) => {
      if (loading || isSearching || activeCategory !== "All") return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isSearching, activeCategory]
  );

  useEffect(() => {
    if (page === 0) return;
    fetchAllBusinesses(page);
  }, [page]);

  /* ============================= */
  /* RENDER */
  /* ============================= */
  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <CategoryTabs onCategoryChange={handleCategoryChange} />

      <div className="home-container">
        {isSearching ? (
          <div className="normal-section">
            <h2 className="section-title">Search Results</h2>
            <div className="normal-grid">
              {searchResults.map((business) => (
                <Card
                id={business.id}
                  key={business.id}
                  image={business.flyerImg}
                  title={business.title}
                  owner= {business.ownerName}
                  category={business.categoryName}
                  profileImage={
                    business.userImg ||
                    "../public/p.png"
                  }
                />
              ))}
            </div>
            {searchResults.length === 0 && (
              <p style={{ marginTop: "20px" }}>No businesses found.</p>
            )}
          </div>
        ) : activeCategory !== "All" ? (
          <div className="normal-section">
            <h2 className="section-title">{activeCategory} Businesses</h2>
            <div className="normal-grid">
              {categoryResults.map((business) => (
                <Card
                  key={business.id}
                  id={business.id}
                  image={business.flyerImg}
                  title={business.title}
                  owner={business.ownerName}
                  category={business.categoryName}
                  profileImage={
                    business.userImg ||
                    "../public/p.png"
                  }
                />
              ))}
              {categoryResults.length === 0 && (
                <p style={{ marginTop: "20px" }}>
                  No businesses found in this category.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* ================= FEATURED SECTION ================= */}
            <div className="featured-section">
              <h2 className="section-title">⭐ Featured Businesses</h2>

              {featuredBusinesses.length > 0 ? (
                <div className="featured-scroll">
                  {featuredBusinesses.map((business) => (
                    <div
                      className="featured-card-wrapper"
                      key={business.id}
                    >
                      <Card
                      id={business.id}
                        variant="large"
                        image={business.flyerImg}
                        title={business.title}
                        owner={business.ownerName}
                        category={business.categoryName}
                        profileImage={
                          business.userImg ||
                          "../public/p.png"
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="featured-empty">
                  <div className="featured-empty-box">
                    <h3>No Featured Businesses Yet</h3>
                    <p>
                      Want your business showcased at the top of our platform?
                    </p>
                    <div className="featured-contact">
                      Contact us to get your business featured:
                      <strong> 09088874776</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* USER BUSINESSES */}
            {userBusinesses.length > 0 && (
              <div className="normal-section">
                <h2 className="section-title">Your Businesses</h2>
                <div className="normal-grid">
                  {userBusinesses.map((business) => (
                    <Card
                      key={business.id}
                      id={business.id}
                      image={business.flyerImg}
                      title={business.title}
                      owner="You"
                      category={business.categoryName}
                     profileImage={
                            business.userImg ||
                            "../public/p.png"
                          }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ALL BUSINESSES */}
            <div className="normal-section">
              <h2 className="section-title">All Businesses</h2>
              <div className="normal-grid">
                {allBusinesses.map((business, index) => {
                  if (index === allBusinesses.length - 1) {
                    return (
                      <div ref={observerCallback} key={business.id}>
                        <Card
                        id={business.id}
                          image={business.flyerImg}
                          title={business.title}
                          owner={business.ownerName}
                          category={business.categoryName}
                          profileImage={
                            business.userImg ||
                            "../public/p.png"
                          }
                        />
                      </div>
                    );
                  }
                  return (
                    <Card
                    id={business.id}
                      key={business.id}
                      image={business.flyerImg}
                      title={business.title}
                      owner={business.ownerName}
                      category={business.categoryName}
                      profileImage={
                        business.userImg ||
                        "../public/p.png"
                      }
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;