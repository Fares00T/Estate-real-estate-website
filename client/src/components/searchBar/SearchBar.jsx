import { useState, useEffect } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [cities, setCities] = useState([]); // Store city data
  const [districts, setDistricts] = useState([]); // Store districts of the selected city

  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    district: "",
    minPrice: 0,
    maxPrice: 0,
  });

  // Fetch city data from JSON file
  useEffect(() => {
    fetch("/wilaya.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error loading cities:", err));
  }, []);

  // Update districts when city changes
  useEffect(() => {
    const selectedCity = cities.find((c) => c.name === query.city);
    setDistricts(selectedCity ? selectedCity.dairats : []);
    setQuery((prev) => ({ ...prev, district: "" })); // Reset district when city changes
  }, [query.city, cities]);

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        {/* City Dropdown */}
        <select name="city" onChange={handleChange} value={query.city}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.mattricule} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        {/* District Dropdown */}
        <select
          name="district"
          onChange={handleChange}
          value={query.district}
          disabled={!query.city} // Disable if no city is selected
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.code} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&district=${query.district}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img src="/search.png" alt="Search" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
