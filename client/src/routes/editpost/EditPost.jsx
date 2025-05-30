// routes/postUpdate/EditPost.jsx
import { useState, useEffect } from "react";
import "./editPost.scss"; // You'll need to create this CSS file
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../components/lib/apiRequest.js";
import LocationPicker from "../../components/getloc/LocationPicker.jsx";
import UploadWidget from "../../components/UploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { FormControl, FormHelperText, TextField } from "@mui/material";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [property, setProperty] = useState("");
  const [post, setPost] = useState(null);

  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    title: "",
    price: "",
    address: "",
    district: "",
    bedroom: "",
    bathroom: "",
    type: "",
    property: "",
    propertyType: "",
    utilities: "",
    pet: "",
    Furnished: "",
    size: "",
  });

  const [nearbyPlaces, setNearbyPlaces] = useState({
    kindergarten: false,
    primarySchool: false,
    middleSchool: false,
    highSchool: false,
    university: false,
    carPark: false,
    transportation: false,
    mosque: false,
    pharmacy: false,
    commercialArea: false,
  });

  // Load cities from JSON
  useEffect(() => {
    fetch("/wilaya.json")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error loading cities:", err));
  }, []);

  // Load existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiRequest.get(`/posts/${id}`);
        const postData = response.data;
        setPost(postData);

        // Set form data
        setForm({
          latitude: postData.latitude || "",
          longitude: postData.longitude || "",
          title: postData.title || "",
          price: postData.price || "",
          address: postData.address || "",
          district: postData.district || "",
          bedroom: postData.bedroom || "",
          bathroom: postData.bathroom || "",
          type: postData.type || "",
          property: postData.property || "",
          propertyType: postData.propertyType || "",
          utilities: postData.postDetail?.utilities || "",
          pet: postData.postDetail?.pet || "",
          Furnished: postData.postDetail?.Furnished || "",
          size: postData.postDetail?.size || "",
        });

        setSelectedCity(postData.city || "");
        setProperty(postData.property || "");
        setValue(postData.postDetail?.desc || "");
        setImages(postData.images || []);

        // Set nearby places
        if (postData.postDetail) {
          setNearbyPlaces({
            kindergarten: postData.postDetail.kindergarten === "yes",
            primarySchool: postData.postDetail.primarySchool === "yes",
            middleSchool: postData.postDetail.middleSchool === "yes",
            highSchool: postData.postDetail.highSchool === "yes",
            university: postData.postDetail.university === "yes",
            carPark: postData.postDetail.carPark === "yes",
            transportation: postData.postDetail.transportation === "yes",
            mosque: postData.postDetail.mosque === "yes",
            pharmacy: postData.postDetail.pharmacy === "yes",
            commercialArea: postData.postDetail.commercialArea === "yes",
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post data");
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Update districts when city changes
  useEffect(() => {
    if (selectedCity) {
      const cityData = cities.find((city) => city.name === selectedCity);
      setDistricts(cityData ? cityData.dairats : []);
    } else {
      setDistricts([]);
    }
  }, [selectedCity, cities]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNearbyPlaceChange = (place) => {
    setNearbyPlaces((prev) => ({
      ...prev,
      [place]: !prev[place],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const updateData = {
        postData: {
          title: form.title,
          price: parseInt(form.price),
          address: form.address,
          city: selectedCity,
          district: form.district,
          bedroom: parseInt(form.bedroom),
          bathroom: parseInt(form.bathroom),
          type: form.type,
          property: form.property,
          propertyType: form.propertyType,
          latitude: form.latitude,
          longitude: form.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: form.utilities,
          pet: form.pet,
          Furnished: form.Furnished,
          size: parseInt(form.size),
          kindergarten: nearbyPlaces.kindergarten ? "yes" : "no",
          primarySchool: nearbyPlaces.primarySchool ? "yes" : "no",
          middleSchool: nearbyPlaces.middleSchool ? "yes" : "no",
          highSchool: nearbyPlaces.highSchool ? "yes" : "no",
          university: nearbyPlaces.university ? "yes" : "no",
          carPark: nearbyPlaces.carPark ? "yes" : "no",
          transportation: nearbyPlaces.transportation ? "yes" : "no",
          mosque: nearbyPlaces.mosque ? "yes" : "no",
          pharmacy: nearbyPlaces.pharmacy ? "yes" : "no",
          commercialArea: nearbyPlaces.commercialArea ? "yes" : "no",
        },
      };

      const response = await apiRequest.put(`/posts/${id}`, updateData);
      navigate(`/${id}`); // Redirect to the updated post
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post. Please try again.");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
        },
        (error) => {
          alert("Unable to retrieve your location. Please allow permission.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (loading) {
    return <div className="loading">Loading post data...</div>;
  }

  if (error && !post) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="editPostPage">
      <div className="formContainer">
        <h1>Edit Property</h1>
        <div className="wrapper">
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="item">
              <label htmlFor="address">Street</label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleInputChange}
                required
              />
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
              <select
                id="district"
                name="district"
                value={form.district}
                onChange={handleInputChange}
                required
              >
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
                value={form.bedroom}
                onChange={handleInputChange}
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
                value={form.bathroom}
                onChange={handleInputChange}
                required
              />
            </div>

            <FormControl fullWidth>
              <FormHelperText sx={{ mb: 3 }}>
                🗺 Tip: Use the map below to choose your Latitude and Longitude
              </FormHelperText>
              <TextField
                id="latitude"
                label="Latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleInputChange}
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="longitude"
                label="Longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleInputChange}
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
              initialLat={parseFloat(form.latitude)}
              initialLng={parseFloat(form.longitude)}
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
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
              >
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property Category</label>
              <select
                name="property"
                id="property"
                value={form.property}
                onChange={(e) => {
                  setProperty(e.target.value);
                  setForm((prev) => ({ ...prev, property: e.target.value }));
                }}
                required
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
                value={form.propertyType}
                onChange={handleInputChange}
                required
              >
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
              <select
                name="utilities"
                id="utilities"
                value={form.utilities}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pets Allowed</label>
              <select
                name="pet"
                id="pet"
                value={form.pet}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="Furnished">Furnished?</label>
              <select
                name="Furnished"
                id="Furnished"
                value={form.Furnished}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="size">Size (m²)</label>
              <input
                id="size"
                name="size"
                type="number"
                value={form.size}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="item">
              <h3>Nearby Places</h3>
            </div>

            {Object.entries(nearbyPlaces).map(([place, checked]) => (
              <div className="item" key={place}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleNearbyPlaceChange(place)}
                  />
                  {place
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}{" "}
                  Nearby
                </label>
              </div>
            ))}

            <div className="item">
              <label>Images</label>
              <UploadWidget
                uwConfig={{
                  multiple: true,
                  cloudName: "your-cloudinary-name", // Replace with your cloudinary name
                  uploadPreset: "estate", // Replace with your upload preset
                  folder: "posts",
                }}
                setState={setImages}
              />
              <div className="imagePreview">
                {images.map((image, index) => (
                  <img key={index} src={image} alt={`Preview ${index}`} />
                ))}
              </div>
            </div>

            <div className="buttons">
              <button type="button" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit">Update Property</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
