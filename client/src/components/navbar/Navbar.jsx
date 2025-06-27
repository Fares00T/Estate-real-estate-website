import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X, User, Home, Building, FileText, Users } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest(".mobile-menu-container")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleMenuItemClick = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="left">
          <Link to="/" className="logo" onClick={handleMenuItemClick}>
            <Building className="logo-icon" />
            <span>Estate</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/about" className="nav-link">
              <FileText size={18} />
              <span>About</span>
            </Link>
            <Link to="/agencies" className="nav-link">
              <Users size={18} />
              <span>Agencies</span>
            </Link>
            {currentUser?.role === "client" && (
              <Link to="/agency" className="nav-link">
                <Building size={18} />
                <span>Apply as Agency</span>
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link to="/admin" className="nav-link admin-link">
                <User size={18} />
                <span>Admin</span>
              </Link>
            )}
            <Link to="/report" className="nav-link">
              <FileText size={18} />
              <span>Report</span>
            </Link>
          </div>
        </div>

        <div className="right">
          {currentUser ? (
            <div className="user-section">
              {currentUser?.role === "agency" && (
                <span className="role-badge agency-badge">Agency</span>
              )}
              {currentUser?.role === "admin" && (
                <span className="role-badge admin-badge">Admin</span>
              )}
              <div className="user-info">
                <Link to="/profile" className="user-avatar">
                  <img
                    src={currentUser.avatar || "/noavatar.jpg"}
                    alt="User avatar"
                    className="avatar-img"
                  />
                </Link>
                <span className="username">{currentUser.username}</span>
              </div>
              <Link to="/profile" className="profile-btn">
                <User size={18} />
                <span>Profile</span>
              </Link>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link signin">
                Sign In
              </Link>
              <Link to="/register" className="auth-link signup">
                Sign Up
              </Link>
            </div>
          )}

          <div className="mobile-menu-container">
            <button
              className="menu-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              aria-label="Toggle mobile menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`mobile-menu ${open ? "active" : ""}`}>
              <div className="mobile-menu-content">
                <div className="mobile-menu-header">
                  <Link
                    to="/"
                    className="mobile-logo"
                    onClick={handleMenuItemClick}
                  >
                    <Building size={24} />
                    <span>Estate</span>
                  </Link>
                </div>

                <div className="mobile-nav-links">
                  <Link
                    to="/"
                    className="mobile-nav-link"
                    onClick={handleMenuItemClick}
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/about"
                    className="mobile-nav-link"
                    onClick={handleMenuItemClick}
                  >
                    <FileText size={20} />
                    <span>About</span>
                  </Link>
                  <Link
                    to="/agencies"
                    className="mobile-nav-link"
                    onClick={handleMenuItemClick}
                  >
                    <Users size={20} />
                    <span>Agencies</span>
                  </Link>
                  {currentUser?.role === "client" && (
                    <Link
                      to="/agency"
                      className="mobile-nav-link"
                      onClick={handleMenuItemClick}
                    >
                      <Building size={20} />
                      <span>Apply as Agency</span>
                    </Link>
                  )}
                  {currentUser?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="mobile-nav-link admin-link"
                      onClick={handleMenuItemClick}
                    >
                      <User size={20} />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <Link
                    to="/report"
                    className="mobile-nav-link"
                    onClick={handleMenuItemClick}
                  >
                    <FileText size={20} />
                    <span>Report</span>
                  </Link>
                </div>

                <div className="mobile-user-section">
                  {currentUser ? (
                    <div className="mobile-user-info">
                      <div className="mobile-user-profile">
                        <img
                          src={currentUser.avatar || "/noavatar.jpg"}
                          alt="User avatar"
                          className="mobile-avatar"
                        />
                        <div className="mobile-user-details">
                          <span className="mobile-username">
                            {currentUser.username}
                          </span>
                          {currentUser?.role === "agency" && (
                            <span className="mobile-role-badge agency">
                              Agency
                            </span>
                          )}
                          {currentUser?.role === "admin" && (
                            <span className="mobile-role-badge admin">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="mobile-profile-btn"
                        onClick={handleMenuItemClick}
                      >
                        <User size={18} />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="mobile-auth-section">
                      <Link
                        to="/login"
                        className="mobile-auth-btn signin"
                        onClick={handleMenuItemClick}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="mobile-auth-btn signup"
                        onClick={handleMenuItemClick}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
