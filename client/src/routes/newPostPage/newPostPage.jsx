import { useState, useEffect } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../components/lib/apiRequest.js";
import UploadWidget from "../../components/UploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);

  const navigate = useNavigate();

  // Load cities from JSON
  useEffect(() => {
    fetch("wilaya.json") // Make sure cities.json is in the public folder
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error loading cities:", err));
  }, []);

  // Update districts when city changes
  useEffect(() => {
    if (selectedCity) {
      const cityData = cities.find((city) => city.name === selectedCity);
      setDistricts(cityData ? cityData.dairats : []);
    } else {
      setDistricts([]);
    }
  }, [selectedCity, cities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: selectedCity,
          district: inputs.district,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError("Error submitting the post.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description and Contact Information</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>

            {/* City Selection */}
            <div className="item">
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.mattricule} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District Selection */}
            <div className="item">
              <label htmlFor="district">District</label>
              <select id="district" name="district" required>
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property Type</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Included</label>
              <select name="utilities" id="utilities">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pets Allowed</label>
              <select name="pet" id="pet">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="size">Size (m)</label>
              <input id="size" name="size" type="number" required />
            </div>

            <div className="item">
              <label htmlFor="school">Nearby Schools</label>
              <input id="school" name="school" type="number" required />
            </div>

            <div className="item">
              <label htmlFor="bus">Nearby Bus Stops</label>
              <input id="bus" name="bus" type="number" required />
            </div>

            <div className="item">
              <label htmlFor="restaurant">Nearby Restaurants</label>
              <input id="restaurant" name="restaurant" type="number" required />
            </div>

            <button className="sendButton">Add</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>

      {/* Image Upload */}
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
