import "./listDetails.scss";
import Slider from "../../components/slider/Slider.jsx";
import Map from "../../components/map/Map";
import { useContext, useEffect, useState } from "react";
import apiRequest from "../../components/lib/apiRequest";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import Chat from "../../components/chat/Chat.jsx";

export default function ListDetails() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState(null);
  const [postId, setPostId] = useState(null);
  console.log("Post ID:", postId); // Add this to check if postId is valid
  {
    /*console.log("Post data:", post);
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await apiRequest.post(`/posts/view/${post.id}`); // Adjust if route differs
      } catch (err) {
        console.error("Failed to increment views:", err);
      }
    };

    if (post?.id) {
      incrementViews();
    }
  }, [post?.id]);
  */
  }
  // Make sure setPostId is being called with a valid ID before the fetch call.

  const handleDelete = async () => {
    try {
      const response = await apiRequest.delete(`/posts/${post.id}`);
      /*
      if (response.status === 200) {
        navigate("/admin"); // Redirect after deletion
      }*/
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

  const handleMessage = async () => {
    if (!currentUser) return navigate("/login");

    try {
      const res = await apiRequest.get("/chats");
      const existingChat = res.data.find(
        (chat) =>
          Array.isArray(chat.users) &&
          chat.users.some((user) => user.userId === post.user.id)
      );

      console.log("Existing chat foundd:", existingChat);

      if (existingChat) {
        setChatData(existingChat);
      } else {
        const newChatRes = await apiRequest.post("/chats", {
          receiverId: post.userId,
        });
        console.log("New chat created:", newChatRes.data);

        setChatData(newChatRes.data);
      }

      setChatOpen(true); // Open the chat
    } catch (err) {
      console.log(err);
      alert("Failed to open chat");
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            {currentUser?.id === post.userId && (
              <button
                onClick={() => navigate(`/edit-post/${post.id}`)}
                style={{ backgroundColor: "#007bff", color: "white" }}
              >
                Edit Post
              </button>
            )}
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                  <span>{post.city}</span>
                  <span>{post.district}</span>
                </div>
                <div className="price">DZD {post.price}</div>
                <div className="views">
                  {/*{typeof post.views === "number" ? post.views : "Loading..."}*/}
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
          <p className="title">General</p>
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
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
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
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {currentUser?.id !== post.userId && (
              <button onClick={handleMessage}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
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
          {chatOpen && chatData && (
            <Chat
              chats={[{ ...chatData, receiver: post.user }]} // pass receiver correctly
              onClose={() => setChatOpen(false)}
            />
          )}
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
