import "./listDetails.scss";
import Slider from "../../components/slider/Slider.jsx";
import Map from "../../components/map/Map";
import { useContext, useState } from "react";
import apiRequest from "../../components/lib/apiRequest";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import TourRequestModal from "../../components/tourRequestModal/TourRequestModal.jsx";
import {
  FaMapMarkerAlt,
  FaSchool,
  FaUniversity,
  FaBus,
  FaShoppingCart,
  FaCar,
  FaMosque,
  FaPills,
  FaChild,
  FaGraduationCap,
} from "react-icons/fa";

export default function ListDetails() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  const buildWhatsAppLink = (phone, title, location) => {
    if (!phone) return null;
    const normalizedPhone = phone.replace(/\D/g, "");
    if (!normalizedPhone) return null;
    const message = `Hi, I'm interested in the property "${title}" in ${location}. Is it still available?`;
    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
      message
    )}`;
  };

  const nearbyPlaces = [
    { label: "Mosque", value: post.postDetail.mosque, icon: <FaMosque /> },
    {
      label: "Kindergarten",
      value: post.postDetail.kindergarten,
      icon: <FaChild />,
    },
    {
      label: "Primary School",
      value: post.postDetail.primarySchool,
      icon: <FaSchool />,
    },
    {
      label: "Middle School",
      value: post.postDetail.middleSchool,
      icon: <FaGraduationCap />,
    },
    {
      label: "High School",
      value: post.postDetail.highSchool,
      icon: <FaGraduationCap />,
    },
    {
      label: "University",
      value: post.postDetail.university,
      icon: <FaUniversity />,
    },
    { label: "Pharmacy", value: post.postDetail.pharmacy, icon: <FaPills /> },
    {
      label: "Transportation",
      value: post.postDetail.transportation,
      icon: <FaBus />,
    },
    {
      label: "Commercial Area",
      value: post.postDetail.commercialArea,
      icon: <FaShoppingCart />,
    },
    { label: "Car Park", value: post.postDetail.carPark, icon: <FaCar /> },
  ];

  const handleDelete = async () => {
    try {
      const response = await apiRequest.delete(`/posts/${post.id}`);
      if (response.status === 200) {
        navigate("/admin"); // Redirect after deletion
      }
    } catch (err) {
      console.log(err);
      alert("Failed to delete post.");
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const whatsappLink = buildWhatsAppLink(
    post.user?.phone,
    post.title,
    `${post.district}, ${post.city}`
  );

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            {post.type === "rent" ? "For Rent" : "For Sale"}

            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                  <span>{post.district}</span>
                  <span>{post.city}</span>
                </div>
                <div className="price">DZD {post.price}</div>
                <div className="views">
                  viewed by :{" "}
                  {typeof post.postDetail.views === "number"
                    ? post.postDetail.views
                    : "Loading..."}{" "}
                  pepole
                </div>
              </div>
              <div className="user">
                <img src={post.user.avatar || "noavatar.jpg"} alt="" />
                <span>{post.user.username}</span>
                {post.user.role === "agency" && (
                  <span className="agencyBadge">Trusted Agency</span>
                )}
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          {currentUser?.id === post.userId && (
            <button
              onClick={() => navigate(`/edit-post/${post.id}`)}
              className="btn"
            >
              Edit Post
            </button>
          )}
          <p className="title">General</p>
          <p>Property ID: {post.postDetail.Matricule}</p>
          {currentUser?.role === "client" &&
            currentUser?.id !== post.userId &&
            post.user.role === "agency" && (
              <>
                <button
                  className="btn request-tour-btn"
                  onClick={() => setShowTourModal(true)}
                >
                  Request Tour
                </button>

                {showTourModal && (
                  <TourRequestModal
                    post={post}
                    currentUser={currentUser}
                    onClose={() => setShowTourModal(false)}
                  />
                )}
              </>
            )}
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />

              <div className="featureText">
                <span> is is Furnished</span>

                {post.postDetail.pet === "yes" ? (
                  <p> yes it's Furnished</p>
                ) : (
                  <p>not Furnished</p>
                )}
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>
                {post.postDetail.size} m<sup>2</sup>
              </span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="nearbyList">
            {nearbyPlaces.map(
              (item, index) =>
                item.value === "yes" && (
                  <div className="nearbyItem" key={index}>
                    <div className="icon">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                )
            )}
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {currentUser?.id !== post.userId && whatsappLink && (
              <a
                className="whatsappButton"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                <span>Contact via WhatsApp</span>
              </a>
            )}

            {currentUser?.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this post?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleDelete}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
