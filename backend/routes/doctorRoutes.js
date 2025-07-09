const express = require('express');
const router = express.Router();

const {
  createDoctor,
  getDoctorBySlug,
  filterDoctors,
  getDoctorsByUser,
  getDoctorById,
  updateDoctor,
  getLatestDoctors
} = require('../controllers/doctorController');

const { uploadFields } = require('../middleware/multer');
const authenticateJWT = require('../middleware/authMiddleware');

// 🩺 Create new doctor
router.post('/', authenticateJWT, uploadFields, createDoctor);

// 🔍 Filter/Search doctors
router.get('/', filterDoctors);

// 👤 Doctors added by logged-in user
router.get('/mydoctors', authenticateJWT, getDoctorsByUser);

// 🔗 Doctor by category/slug
router.get('/:area/:category/:slug', getDoctorBySlug);

// 🆕 Latest doctors
router.get('/latest', getLatestDoctors);

// ✏️ Get doctor by ID
router.get('/:id', getDoctorById);

// 🗑️ Delete doctor
router.delete('/:id', authenticateJWT, require('../controllers/doctorController').deleteDoctor);

// 🔄 Update doctor
router.put('/:id', authenticateJWT, uploadFields, updateDoctor);

module.exports = router;
