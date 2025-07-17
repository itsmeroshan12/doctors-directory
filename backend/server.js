require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://13.232.11.181:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/search', searchRoutes);

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Serve React frontend (production build)
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// ✅ Start server
async function startServer() {
  try {
    await pool.getConnection();
    console.log('✅ MySQL database connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  } catch (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
}

startServer();
