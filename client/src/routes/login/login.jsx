import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../components/lib/apiRequest.js";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { updateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        email,
        password,
      });

      //localStorage.setItem("user", JSON.stringify(res.data));
      updateUser(res.data);
      // updateUser(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome</h1>
          <input
            name="email"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Email"
          />
          <input
            name="password"
            required
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/public/bg1.png"></img>
      </div>
    </div>
  );
}

export default Login;
