import { useState, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cities, setCities] = useState([]); // Store cities from JSON file
  const [districts, setDistricts] = useState([]); // Store districts of selected city

  const [query, setQuery] = useState({
    city: searchParams.get("city") || "",
    district: searchParams.get("district") || "",
    type: searchParams.get("type") || "",
    property: searchParams.get("property") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
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

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value) // Remove empty fields
    );

    setSearchParams(filteredQuery);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            onChange={handleChange}
            value={query.city}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.mattricule} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="item">
          <label htmlFor="district">District</label>
          <select
            id="district"
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
        </div>
        {/* 
        <div className="item">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
            value={query.address}
          />
        </div>
        */}
      </div>

      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="property">Property Category</label>
          <select
            name="property"
            id="property"
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                property: e.target.value,
                propertyType: "", // reset type
              }))
            }
            value={query.property}
          >
            <option value="">Select Category</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="propertyType">Property Type</label>
          <select
            name="propertyType"
            id="propertyType"
            onChange={handleChange}
            value={query.propertyType}
            disabled={!query.property}
          >
            <option value="">Select Type</option>
            {query.property === "residential" && (
              <>
                <option value="apartment">Apartment</option>
                <option value="individual_house">Individual House</option>
                <option value="traditional_house">Traditional House</option>
                <option value="other_residential">Other</option>
              </>
            )}
            {query.property === "commercial" && (
              <>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="hospitality">Hospitality/Leisure</option>
                <option value="industrial">Industrial</option>
              </>
            )}
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>

        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>

        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>

        <button onClick={handleFilter}>
          <img src="/search.png" alt="Search" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
