import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = process.env.REACT_APP_API_BASE;
const categories = [
  "General",
  "Orthopedic",
  "Dental",
  "Cardiology",
  "ENT",
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

const ClinicEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    doctorName: "",
    mobile: "",
    email: "",
    address: "",
    website: "",
    experience: "",
    specialization: "",
    area: "",
    category: "",
    description: "",
    type: "clinic",
    clinicImage: null,
    doctorImage: null,
    otherImage: null,
  });

  const clinicImageRef = useRef(null);
  const doctorImageRef = useRef(null);
  const otherImageRef = useRef(null);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await axios.get(`${API}/api/clinics/${id}`);
        setFormData((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        toast.error("Failed to load clinic");
      }
    };
    fetchClinic();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    if (clinicImageRef.current?.files[0]) {
      data.append("clinicImage", clinicImageRef.current.files[0]);
    }
    if (doctorImageRef.current?.files[0]) {
      data.append("doctorImage", doctorImageRef.current.files[0]);
    }
    if (otherImageRef.current?.files[0]) {
      data.append("otherImage", otherImageRef.current.files[0]);
    }

    try {
      await axios.put(`${API}/api/clinics/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Clinic updated successfully!");
      setTimeout(() => navigate("/user/items"), 2000);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <div className="px-4 mt-3">
        <Button variant="outlined" size="small" onClick={() => navigate("/user/items")}>
          ← Back to Dashboard
        </Button>
      </div>

      <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
        <Typography variant="h5" align="center" mb={3}>
          Edit Clinic Listing
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

            <MenuItem value="clinic">Clinic</MenuItem>

          </TextField>

          <TextField
            label="Clinic Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Doctor Name"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setFormData((prev) => ({ ...prev, mobile: val }));
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
            required
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
            label="Website URL"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Experience (years)"
            name="experience"
            value={formData.experience}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
              setFormData((prev) => ({ ...prev, experience: val }));
            }}
            inputProps={{
              maxLength: 2,
              inputMode: 'numeric',
              pattern: '[0-9]{1,2}',
            }}
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            )}
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

          <Typography mt={2}>Clinic Image</Typography>
          <input
            type="file"
            name="clinicImage"
            accept="image/*"
            onChange={handleChange}
            ref={clinicImageRef}
            style={{ marginBottom: "1rem" }}
          />

          <Typography>Doctor Image</Typography>
          <input
            type="file"
            name="doctorImage"
            accept="image/*"
            onChange={handleChange}
            ref={doctorImageRef}
            style={{ marginBottom: "1rem" }}
          />

          <Typography>Other Image</Typography>
          <input
            type="file"
            name="otherImage"
            accept="image/*"
            onChange={handleChange}
            ref={otherImageRef}
            style={{ marginBottom: "1.5rem" }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update Listing
          </Button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </Box>
    </>
  );
};

export default ClinicEdit;
