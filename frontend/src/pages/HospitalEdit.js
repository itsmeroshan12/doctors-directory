// src/pages/HospitalEdit.js
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

const areas = ["Downtown", "Uptown", "Suburb", "West End", "East Side"];
const categories = ["Multispeciality", "Cardiology", "Pediatric", "Oncology"];

const HospitalEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hospitalImageRef = useRef(null);
  const otherImageRef = useRef(null);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hospitals/${id}`);
        setFormData((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Error fetching hospital:", err);
        toast.error("Failed to load hospital details");
      }
    };

    fetchHospital();
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

    setIsSubmitting(true);
    const formPayload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "hospitalImage" && key !== "otherImage" && value) {
        formPayload.append(key, value);
      }
    });

    if (hospitalImageRef.current?.files[0]) {
      formPayload.append("hospitalImage", hospitalImageRef.current.files[0]);
    }
    if (otherImageRef.current?.files[0]) {
      formPayload.append("otherImage", otherImageRef.current.files[0]);
    }

    try {
      await axios.put(`http://localhost:5000/api/hospitals/${id}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Hospital updated successfully!", {
        onClose: () => navigate("/user/items"),
      });
    } catch (err) {
      console.error("Error updating hospital:", err);
      toast.error("Update failed!");
    } finally {
      setIsSubmitting(false);
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
          Edit Hospital
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
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
            value={formData.area || ""}
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
            value={formData.category || ""}
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
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
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
            
            <MenuItem value="hospital">Hospital</MenuItem>
            </TextField>

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
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,10}$/.test(val)) {
                setFormData((prev) => ({ ...prev, mobile: val }));
              }
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Hospital"}
          </Button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </Box>
    </>
  );
};

export default HospitalEdit;
