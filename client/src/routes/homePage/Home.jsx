import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./home.scss";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  console.log("Backend URL:", import.meta.env.VITE_BACK_END_URL);
  console.log(currentUser);
  return (
    <div className="homepage">
      <div className="textcont">
        <div className="heroText">
          <h1 className="title">Find the Home and get your dream place</h1>
          <p className="px-4 py-2 text-lg text-gray-600">
            Discover your dream home with ease. Explore our wide range of
            properties available for rent or sale, tailored to fit your needs.
            Start your journey to a new place you'll love today!
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="imgcont">
        <img src="/src/routes/homePage/bg1.png"></img>
      </div>
    </div>
  );
};

export default Home;
