const express = require('express');
const router = express.Router();

const {
  createClinic,
  getClinicBySlug,
  filterClinics,
  getClinicsByUser,
  getClinicById,
  updateClinic,
  deleteClinic,
  getLatestClinics
} = require('../controllers/clinicController');

const { uploadFields } = require('../middleware/multer');
const authenticateJWT = require('../middleware/authMiddleware');

// POST: Create new clinic
router.post('/', authenticateJWT, uploadFields, createClinic);

// GET: Filter/search clinics
router.get('/', filterClinics);

// GET: Clinics created by the logged-in user
router.get('/myclinics', authenticateJWT, getClinicsByUser);

// GET: Latest clinics
router.get('/latest', getLatestClinics);

// GET: View single clinic by slug
router.get('/:area/:category/:slug', getClinicBySlug);

// GET: Clinic by ID (for editing)
router.get('/:id', getClinicById);

// PUT: Update clinic by ID
router.put('/:id', authenticateJWT, uploadFields, updateClinic);

// DELETE: Remove clinic by ID
router.delete('/:id', authenticateJWT, deleteClinic);

module.exports = router;
