import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    district: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetch("/wilaya.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Error loading cities:", err));
  }, []);

  useEffect(() => {
    const selectedCity = cities.find((c) => c.name === query.city);
    setDistricts(selectedCity ? selectedCity.dairats : []);
    setQuery((prev) => ({ ...prev, district: "" }));
  }, [query.city, cities]);

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {types.map((type) => (
          <Button
            key={type}
            variant={query.type === type ? "contained" : "outlined"}
            onClick={() => switchType(type)}
          >
            {type}
          </Button>
        ))}
      </Box>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column", md: "row" }, // Stack on small screens, row on larger
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "space-between", // Ensures the fields are spaced out properly
        }}
        sm={{ flexDirection: "column" }} // Column layout on small screens
        md={{ flexDirection: "column" }} // Row layout on medium and larger screens
      >
        {/* City */}
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel>City</InputLabel>
          <Select
            name="city"
            value={query.city}
            onChange={handleChange}
            label="City"
          >
            <MenuItem value="">Select City</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.mattricule} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* District */}
        <FormControl fullWidth sx={{ flex: 1 }} disabled={!query.city}>
          <InputLabel>District</InputLabel>
          <Select
            name="district"
            value={query.district}
            onChange={handleChange}
            label="District"
          >
            <MenuItem value="">Select District</MenuItem>
            {districts.map((district) => (
              <MenuItem key={district.code} value={district.name}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Min Price */}
        <TextField
          type="number"
          name="minPrice"
          label="Min Price"
          value={query.minPrice}
          onChange={handleChange}
          inputProps={{ min: 0 }}
          fullWidth
          sx={{ flex: 1 }}
        />

        {/* Max Price */}
        <TextField
          type="number"
          name="maxPrice"
          label="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
          inputProps={{ min: 0 }}
          fullWidth
          sx={{ flex: 1 }}
        />

        {/* Search Button */}
        <Link
          to={`/list?type=${query.type}&city=${query.city}&district=${query.district}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="contained"
            color="warning"
            sx={{ height: "100%", width: "100%" }}
          >
            Search
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default SearchBar;
