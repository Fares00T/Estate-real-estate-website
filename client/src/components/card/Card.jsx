import { Link } from "react-router-dom";
import "./card.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Card({ item, onDelete }) {
  const { currentUser } = useContext(AuthContext);
  const isAgency = item.user?.role === "agency";
  const normalizedPhone = item.user?.phone?.replace(/\D/g, "");
  const whatsappLink = normalizedPhone
    ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
        `Hi, I'm interested in the property "${item.title}" in ${item.district}, ${item.city}. Is it still available?`
      )}`
    : null;
  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title} </Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
          <span>{item.district}</span>
          <span>{item.city}</span>
        </p>
        <p className="price">DZD {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
            {isAgency && (
              <div className="featureagency">
                <span className="agencyLabel">Trusted Agency</span>
              </div>
            )}
          </div>
        </div>

        {whatsappLink && currentUser?.id !== item.userId && (
          <a
            className="whatsappLink"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            Contact via WhatsApp
          </a>
        )}

        {/* Only show the delete button if onDelete is provided */}
        {onDelete && (
          <button className="deleteBtn" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
