import "./card.css";

function Card({ image, title, owner, category, profileImage }) {
  return (
    <div className="card">
      <div className="card-thumbnail">
        <img src={image} alt={title} />
      </div>

      <div className="card-info">
        <div className="card-avatar">
          <img src={profileImage} alt={owner} />
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
