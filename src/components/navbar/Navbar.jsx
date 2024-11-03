import { useState } from "react";
import "./navbar.scss";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="left">
        <a className="logo" href="/">
          <img src="https://eurobuildawards.com/wp-content/uploads/2016/11/invesco_stacked_blue-300x263.png"></img>
          <span>HOMES</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Agents</a>
      </div>
      <div className="right">
        <a href="/">Sign UP</a>
        <a className="register" href="/">
          Sign IN
        </a>
        <div className="menuIcon">
          <img
            height="30px"
            src="/src/components/menuburger.png"
            onClick={() => setOpen(!open)}
          ></img>
        </div>
        <div className={open ? "sideMenu active" : "sideMenu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          <a href="/">Sign UP</a>
          <a className="register" href="/">
            Sign IN
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
