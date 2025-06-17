import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
//import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  // const fetch = useNotificationStore((state) => state.fetch);
  // const number = useNotificationStore((state) => state.number);

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          {/*<img src="/" alt="" />*/}
          <span>Estate</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/agencies">Agencies</a>
        {currentUser?.role === "client" && (
          <Link to="/agency">applay as an agency</Link>
        )}
        {currentUser?.role === "admin" && <Link to="/admin">Admin</Link>}
        <a href="/report">Report</a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            {currentUser?.role === "agency" && (
              <span className="agency-label">Agency</span>
            )}
            <a href="/profile">
              <img
                className="userimg"
                src={currentUser.avatar || "/noavatar.jpg"}
                alt=""
              />
            </a>
            <span>{currentUser.username}</span>

            <Link to="/profile" className="profile">
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register">Sign up</a> {/* className="register" */}
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          {currentUser ? (
            <div className="user">
              {currentUser?.role === "agency" && (
                <span className="agency-label">Agency</span>
              )}
              <span>{currentUser.username}</span>
              <a href="/profile">
                <img
                  className="userimg"
                  src={currentUser.avatar || "/noavatar.jpg"}
                  alt=""
                />
              </a>
              <Link to="/profile" className="profilemobile">
                <span className="profilemobile">Profile</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="notloggedin">
                <a href="/login">Sign in</a>
                <a href="/register">Sign up</a> {/* className="register" */}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
