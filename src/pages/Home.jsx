import Navbar from "../components/Navbar";
import CategoryTabs from "../components/CategoryTabs";
import Card from "../components/Card";
import "./home.css";

function Home() {
  const featuredBusinesses = [
    {
      id: 1,
      title: "Tech Solutions Ltd",
      owner: "John Doe",
      category: "Tech",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
      profileImage:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      title: "Delicious Bites",
      owner: "Mary Johnson",
      category: "Food",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      profileImage:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      title: "Home Repair Pro",
      owner: "David Smith",
      category: "Home Service",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      profileImage:
        "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 4,
      title: "Fashion Hub",
      owner: "Lisa Brown",
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
      profileImage:
        "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <div>
      <Navbar />
      <CategoryTabs />

      <div className="home-container">

        {/* FEATURED SECTION */}
        <div className="featured-section">
          <h2 className="section-title">⭐ Featured Businesses</h2>

          <div className="featured-scroll">
            {featuredBusinesses.map((business) => (
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

        {/* NORMAL SECTION */}
        <div className="normal-section">
          <h2 className="section-title">All Businesses</h2>

          <div className="normal-grid">
            {[1,2,3,4,5,6,7,8].map((item) => (
              <Card
                key={item}
                image="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
                profileImage="https://randomuser.me/api/portraits/men/32.jpg"
                title={`Business ${item}`}
                owner="Owner Name"
                category="Tech"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
