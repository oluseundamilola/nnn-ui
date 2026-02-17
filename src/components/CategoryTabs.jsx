import { useState } from "react";
import "./categoryTabs.css";

function CategoryTabs() {
  const categories = [
    "All",
    "Tech",
    "Food",
    "Home Service",
    "Fashion",
    "Health",
    "Education",
    "Automobile",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-btn ${
            activeCategory === cat ? "active" : ""
          }`}
          onClick={() => setActiveCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
