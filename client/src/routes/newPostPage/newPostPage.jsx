import { useState, useEffect } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../components/lib/apiRequest.js";
import LocationPicker from "../../components/getloc/LocationPicker.jsx";
import UploadWidget from "../../components/UploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { FormControl, FormHelperText, TextField } from "@mui/material";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [property, setProperty] = useState("");
  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    // add other fields as needed
  });

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
          propertyType: inputs.propertyType,
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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
        },
        (error) => {
          alert("Unable to retrieve your location. Please allow permission.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
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

            <FormControl fullWidth>
              <FormHelperText sx={{ mb: 3 }}>
                🗺 Tip: Use the map under to chose your Latitude and Longitude
              </FormHelperText>
              <TextField
                label="Latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                disabled
              />
              <Button
                variant="outlined"
                onClick={handleGetLocation}
                sx={{ mt: 2 }}
              >
                📍 Get Current Location
              </Button>
            </FormControl>

            <LocationPicker
              onLocationChange={(coords) =>
                setForm((prev) => ({
                  ...prev,
                  latitude: coords.lat.toFixed(6),
                  longitude: coords.lng.toFixed(6),
                }))
              }
            />

            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property Category</label>
              <select
                name="property"
                id="property"
                required
                onChange={(e) => {
                  setProperty(e.target.value);
                }}
              >
                <option value="">Select Category</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="propertyType">Property Type</label>
              <select name="propertyType" id="propertyType" required>
                <option value="">Select Type</option>
                {property === "residential" && (
                  <>
                    <option value="apartment">Apartment</option>
                    <option value="individual_house">Individual House</option>
                    <option value="traditional_house">Traditional House</option>
                    <option value="other_residential">Other</option>
                  </>
                )}
                {property === "commercial" && (
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
