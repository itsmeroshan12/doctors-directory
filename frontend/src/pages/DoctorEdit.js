// src/pages/DoctorEdit.js
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const areas = ["Baner", "Kothrud", "Wakad", "Hinjewadi", "Aundh", "Kharadi", "Hadapsar"];
const categories = [
  "General Physician",
  "Cardiology",
  "ENT",
  "Orthopedic",
  "Dental",
  "Dermatology",
  "Neurology",
  "Gynecology",
];

const DoctorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    category: "",
    specialization: "",
    experienceYears: "",
    type: "",
    description: "",
    qualifications: "",
    languagesSpoken: "",
    address: "",
    mobile: "",
    email: "",
    doctorImage: null,
    clinicImage: null,
    otherImage: null,
  });

  const doctorImageRef = useRef(null);
  const clinicImageRef = useRef(null);
  const otherImageRef = useRef(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setFormData((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Error fetching doctor:", err);
        toast.error("Failed to load doctor details");
      }
    };

    fetchDoctor();
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

    if (formData.mobile.length !== 10) {
      return toast.warn("Mobile number must be 10 digits");
    }

    if (!/^\d{1,2}$/.test(formData.experienceYears)) {
      return toast.warn("Experience must be a number up to 2 digits");
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "doctorImage" &&
        key !== "clinicImage" &&
        key !== "otherImage" &&
        value
      ) {
        formPayload.append(key, value);
      }
    });

    if (doctorImageRef.current?.files[0]) {
      formPayload.append("doctorImage", doctorImageRef.current.files[0]);
    }
    if (clinicImageRef.current?.files[0]) {
      formPayload.append("clinicImage", clinicImageRef.current.files[0]);
    }
    if (otherImageRef.current?.files[0]) {
      formPayload.append("otherImage", otherImageRef.current.files[0]);
    }

    try {
      await axios.put(`http://localhost:5000/api/doctors/${id}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Doctor updated successfully!");
      setTimeout(() => navigate("/user/items"), 2000);
    } catch (err) {
      console.error("Error updating doctor:", err);
      toast.error("Update failed!");
    }
  };

  return (
    <>
      <div className="px-4 mt-3">
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/user/items")}
        >
          ← Back to Dashboard
        </Button>
      </div>

      <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
        <Typography variant="h5" align="center" mb={3}>
          Edit Doctor
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            options={areas}
            value={formData.area}
            onChange={(e, newVal) =>
              setFormData((prev) => ({ ...prev, area: newVal || "" }))
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
            onChange={(e, newVal) =>
              setFormData((prev) => ({ ...prev, category: newVal || "" }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                margin="normal"
                required
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
            )}
          />

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
            <MenuItem value="doctor">Doctor</MenuItem>

          </TextField>

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
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
              setFormData((prev) => ({ ...prev, experienceYears: val }));
            }}
            inputProps={{
              maxLength: 2,
              inputMode: "numeric",
              pattern: "[0-9]{1,2}",
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
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
              setFormData((prev) => ({ ...prev, mobile: val }));
            }}
            inputProps={{
              maxLength: 10,
              inputMode: "numeric",
              pattern: "[0-9]{10}",
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
            required
          />

          <Typography mt={2}>Doctor Image</Typography>
          <input
            type="file"
            name="doctorImage"
            accept="image/*"
            onChange={handleChange}
            ref={doctorImageRef}
            style={{ marginBottom: "1rem" }}
          />

          <Typography>Clinic Image</Typography>
          <input
            type="file"
            name="clinicImage"
            accept="image/*"
            onChange={handleChange}
            ref={clinicImageRef}
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
            Update Doctor
          </Button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </Box>
    </>
  );
};

export default DoctorEdit;
