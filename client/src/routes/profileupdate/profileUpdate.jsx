import { useContext, useState } from "react";
import "./profileupdate.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../components/lib/apiRequest.js";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/UploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(
        `/users/${currentUser.id}`,
        {
          ...data,
          avatar: avatar[0],
        },
        {
          withCredentials: true,
        }
      );

      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>

          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>

          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>

          {/* Show these only if user is an agency */}
          {currentUser.role === "agency" && (
            <>
              <div className="item">
                <label htmlFor="agencyName">Agency Name</label>
                <input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  defaultValue={currentUser.agencyName || ""}
                />
              </div>

              <div className="item">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  defaultValue={currentUser.phone || ""}
                />
              </div>

              <div className="item">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={currentUser.location || ""}
                />
              </div>

              <div className="item">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  defaultValue={currentUser.website || ""}
                />
              </div>

              <div className="item">
                <label htmlFor="about">About</label>
                <textarea
                  id="about"
                  name="about"
                  rows="3"
                  defaultValue={currentUser.about || ""}
                />
              </div>
            </>
          )}

          <button c>Update</button>
          {error && <span className="error">{error}</span>}
        </form>
      </div>

      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "lamadev",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
