import { useState, useEffect } from "react";
import "./categoryTabs.css";

function CategoryTabs({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/business/get-category`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "00") {
          setCategories([{ id: 0, category: "All" }, ...data.data]);
        }
      })
      .catch((err) => console.error("Failed to fetch categories", err))
      .finally(() => setLoading(false));
  }, []);

  const formatCategory = (cat) => {
    return cat.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-btn ${
            activeCategory === cat.category ? "active" : ""
          }`}
          onClick={() => handleClick(cat.category)}
        >
          {formatCategory(cat.category)}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;