// middleware/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'clinicImage', maxCount: 1 },
  { name: 'doctorImage', maxCount: 1 },
  { name: 'hospitalImage', maxCount: 1 },
  { name: 'otherImage', maxCount: 1 },
]);

module.exports = { uploadFields };
