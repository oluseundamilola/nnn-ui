import Card from "../components/Card";

function Home() {
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      <Card
        image="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
        profileImage="https://randomuser.me/api/portraits/men/32.jpg"
        title="Tech Solutions Ltd"
        owner="John Doe"
        category="Tech"
      />

      <Card
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
        profileImage="https://randomuser.me/api/portraits/women/44.jpg"
        title="Delicious Bites"
        owner="Mary Johnson"
        category="Food"
      />
    </div>
  );
}

export default Home;
