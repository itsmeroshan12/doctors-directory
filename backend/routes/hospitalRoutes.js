const express = require('express');
const router = express.Router();

const {
  createHospital,
  getHospitalBySlug,
  filterHospitals,
  getHospitalsByUser,
  getHospitalById,
  updateHospital,
  getLatestHospitals
} = require('../controllers/hospitalController');

const { uploadFields } = require('../middleware/multer');
const authenticateJWT = require('../middleware/authMiddleware');

// 🏥 Create hospital
router.post('/', authenticateJWT, uploadFields, createHospital);

// 🔍 Filter hospitals
router.get('/', filterHospitals);

// 👤 Logged-in user's hospitals
router.get('/myhospitals', authenticateJWT, getHospitalsByUser);

// 🆕 Latest hospitals
router.get('/latest', getLatestHospitals);

// 🔗 SEO-friendly single hospital
router.get('/:area/:slug', getHospitalBySlug);

// 🔄 Edit hospital
router.get('/:id', getHospitalById);
router.put('/:id', authenticateJWT, uploadFields, updateHospital);

// 🗑️ Delete hospital
router.delete('/:id', authenticateJWT, require('../controllers/hospitalController').deleteHospital);

module.exports = router;
