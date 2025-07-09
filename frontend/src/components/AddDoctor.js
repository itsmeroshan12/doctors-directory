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

const categories = [
  "General-Physician",
  "Cardiology",
  "ENT",
  "Orthopedic",
  "Dental",
  "Dermatology",
  "Neurology",
  "Gynecology",
];

const areas = [
  "Baner",
  "Kothrud",
  "Wakad",
  "Hinjewadi",
  "Aundh",
  "Kharadi",
  "Hadapsar",
];

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    area: "",
    category: "",
    type: "",
    description: "",
    languagesSpoken: "",
    experienceYears: "",
    qualifications: "",
    mobile: "",
    email: "",
    address: "",
    doctorImage: null,
    clinicImage: null,
    otherImage: null,
  });

  const doctorImageRef = useRef();
  const clinicImageRef = useRef();
  const otherImageRef = useRef();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mobile") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else if (name === "experienceYears") {
      const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 2); // ✅ Two-digit restriction
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
      const res = await axios.post("http://localhost:5000/api/doctors", data, {
        withCredentials: true,
      });
      toast.success("Doctor added successfully");

      // Reset form
      setFormData({
        name: "",
        specialization: "",
        area: "",
        category: "",
        type: "",
        description: "",
        languagesSpoken: "",
        experienceYears: "",
        qualifications: "",
        mobile: "",
        email: "",
        address: "",
        doctorImage: null,
        clinicImage: null,
        otherImage: null,
      });

      if (doctorImageRef.current) doctorImageRef.current.value = "";
      if (clinicImageRef.current) clinicImageRef.current.value = "";
      if (otherImageRef.current) otherImageRef.current.value = "";

      setTimeout(() => {
        navigate("/user/items");
      }, 2000);
    } catch (err) {
      toast.error("Error adding doctor");
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
          Add Doctor
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
            <MenuItem value="clinic">Doctor</MenuItem>
          </TextField>
          <TextField
            label="Doctor Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
            label="Languages Spoken"
            name="languagesSpoken"
            value={formData.languagesSpoken}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Experience (Years)"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Qualifications"
            name="qualifications"
            value={formData.qualifications}
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
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
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

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            required
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

          <Typography mt={2}>Doctor Image </Typography>
          <input
            type="file"
            name="doctorImage"
            accept="image/*"
            onChange={handleChange}
            ref={doctorImageRef}
            style={{ marginBottom: "1rem" }}
            required
          />

          <Typography>Clinic Image </Typography>
          <input
            type="file"
            name="clinicImage"
            accept="image/*"
            onChange={handleChange}
            ref={clinicImageRef}
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
            Submit Doctor
          </Button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </Box>
    </>
  );
};

export default AddDoctor;
