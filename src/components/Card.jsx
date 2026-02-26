import "./card.css";
import { useNavigate } from "react-router-dom";

function Card({
  id,
  image,
  title,
  owner,
  category,
  profileImage,
  variant
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) return;
    navigate(`/business/${id}`);
  };

  return (
    <div
      className={`card ${variant === "large" ? "card-large" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick();
      }}
    >
      <div className="card-thumbnail">
        <img src={image} alt={title} />
      </div>

      <div className="card-info">
        <div className="card-avatar">
          <img
            src={
              profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={owner}
          />
        </div>

        <div className="card-details">
          <h3 className="card-title">{title}</h3>
          <p className="card-owner">{owner}</p>
          <p className="card-category">{category}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;