import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./home.scss";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className="homepage">
      <div className="textcont">
        <div className="heroText">
          <h1 className="title">Find the Home and get your dream place</h1>
          <p>
            Discover your dream home with ease. Explore our wide range of
            properties available for rent or sale, tailored to fit your needs.
            Start your journey to a new place you'll love today!
          </p>
          <SearchBar />
          <div className="infos">
            <div className="info1">
              <h1>0</h1>
              <h2>Years of exp</h2>
            </div>
            <div className="info2">
              <h1>0</h1>
              <h2>awards</h2>
            </div>
            <div className="info3">
              <h1>0</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="imgcont">
        <img src="/src/routes/homePage/bg.png"></img>
      </div>
      */}
    </div>
  );
};

export default Home;
