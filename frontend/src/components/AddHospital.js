// src/pages/AddHospital.js
import React, { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";

const API = process.env.REACT_APP_API_BASE;
const areas = [
  "Baner", "Kothrud", "Wakad", "Hinjewadi", "Aundh", "Kharadi", "Hadapsar"
];

const categories = [
  "Multispeciality", "Cardiac", "Children", "Orthopedic", "Dental",
  "Gynecology", "ENT", "Neurology"
];

const AddHospital = () => {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    category: "",
    type: "",
    description: "",
    address: "",
    mobile: "",
    email: "",
    website: "",
    hospitalImage: null,
    otherImage: null,
  });

  const hospitalImageRef = useRef();
  const otherImageRef = useRef();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mobile") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post(`${API}/api/hospitals`, data, {
        withCredentials: true,
      });

      toast.success("Hospital added successfully!");

      setFormData({
        name: "",
        area: "",
        category: "",
        type: "",
        description: "",
        address: "",
        mobile: "",
        email: "",
        website: "",
        hospitalImage: null,
        otherImage: null,
      });

      if (hospitalImageRef.current) hospitalImageRef.current.value = "";
      if (otherImageRef.current) otherImageRef.current.value = "";

      setTimeout(() => {
        navigate("/user/items");
      }, 2000);
    } catch (err) {
      toast.error("Failed to add hospital.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="px-4 mt-3">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/user/items")}>
          ← Back to DashBoard
        </Button>
      </div>

      <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
        <Typography variant="h5" align="center" mb={3}>
          Add Hospital
        </Typography>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          <TextField
            select
            label="Listing Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="doctor">Hospital</MenuItem>

          </TextField><TextField
            label="Hospital Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <Autocomplete
            freeSolo
            options={areas}
            value={formData.area}
            onChange={(e, newValue) =>
              setFormData((prev) => ({ ...prev, area: newValue || "" }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Area"
                margin="normal"
                required
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, area: e.target.value }))
                }
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={categories}
            value={formData.category}
            onChange={(e, newValue) =>
              setFormData((prev) => ({ ...prev, category: newValue || "" }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                margin="normal"
                required
                onChange={(e) => {
                  const value = e.target.value;

                  // ✅ Check for multiple words
                  if (/\s/.test(value.trim())) {
                    const suggested = value.trim().toLowerCase().replace(/\s+/g, '-');
                    toast.info(`Use "${suggested}" instead of spaces`, {
                      position: "top-center",
                      autoClose: 3000,
                    });
                  }

                  setFormData((prev) => ({ ...prev, category: value }));
                }}
              />
            )}
          />

          

        
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
              setFormData((prev) => ({ ...prev, mobile: val }));
            }}
            inputProps={{
              maxLength: 10,
              inputMode: 'numeric',
              pattern: '[0-9]{10}',
            }}
            fullWidth
            margin="normal"
            required
          />


          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
            <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />


          <Typography mt={2}>Hospital Image</Typography>
          <input
            type="file"
            name="hospitalImage"
            accept="image/*"
            onChange={handleChange}
            ref={hospitalImageRef}
            style={{ marginBottom: "1rem" }}
          />

          <Typography>Other Image (optional)</Typography>
          <input
            type="file"
            name="otherImage"
            accept="image/*"
            onChange={handleChange}
            ref={otherImageRef}
            style={{ marginBottom: "1.5rem" }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Hospital
          </Button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </Box>
    </>
  );
};

export default AddHospital;
