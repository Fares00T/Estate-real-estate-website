import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../components/lib/apiRequest";

function UserCard({ user, onDelete }) {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.role === "admin"; // Check if current user is admin

  const defaultAvatar = "/default-avatar.png"; // Make sure this exists in /public

  return (
    <div className="userCard">
      <img
        src={user.avatar || "/noavatar.jpg"}
        alt={user.username}
        className="userImage"
        onError={(e) => (e.target.src = defaultAvatar)}
      />
      <div className="userInfo">
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        <span className="role">{user.role}</span>
      </div>
      {/* Show delete button only if the user is an admin */}
      {isAdmin && (
        <button className="deleteButton" onClick={() => onDelete(user.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

export default UserCard;
