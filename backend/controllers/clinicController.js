const db = require('../config/db');

// Helper to generate a URL-friendly slug
const generateSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + Date.now();

// Create a new clinic

exports.createClinic = async (req, res) => {
  try {
    console.log('🆕 Creating Clinic for user:', req.user?.userId);
    console.table(req.body);

    const {
      name,
      doctorName,
      qualifications,
      mobile,
      email,
      address,
      website,
      experience,
      specialization,
      area,
      category,
      description,
      type,
    } = req.body;

    const user_id = req.user?.userId || null;

    // Required fields check
    if (!name || !type || !area) {
      return res.status(400).json({ message: 'Name, type, and area are required' });
    }

    // Generate SEO-friendly unique slug
    const slug = generateSlug(name);

    // Handle file uploads
    const clinicImage = req.files?.clinicImage?.[0]?.filename || null;
    const doctorImage = req.files?.doctorImage?.[0]?.filename || null;
    const otherImage = req.files?.otherImage?.[0]?.filename || null;

    const createdAt = new Date();
    const updatedAt = new Date();

    const values = [
      name,
      doctorName,
      qualifications,
      mobile,
      email,
      address,
      website,
      experience,
      specialization,
      area,
      category,
      description,
      type,
      clinicImage,
      doctorImage,
      otherImage,
      slug,
      createdAt,
      updatedAt,
      user_id,
    ];

    console.log("✅ Values count:", values.length);
    console.log("Uploaded files:", req.files);

    const [result] = await db.execute(
      `INSERT INTO clinics 
      (name, doctorName, qualifications, mobile, email, address, website, experience, specialization, area, category, description, type, clinicImage, doctorImage, otherImage, slug, createdAt, updatedAt, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    // Response
    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      area, 
      type,
      clinicImage,
      doctorImage,
      otherImage,
    });
  } catch (error) {
    console.error('❌ Error adding clinic:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get clinic by slug, area, and category
exports.getClinicBySlug = async (req, res) => {
  const {
    slug = '',
    area = '',
    category = '',
  } = req.params;

  try {
    const cleanedArea = area.toLowerCase().trim().replace(/\s+/g, '-');
    const cleanedCategory = category.toLowerCase().trim().replace(/\s+/g, '-');

    let query = `
      SELECT * FROM clinics 
      WHERE slug = ?
        AND REPLACE(LOWER(TRIM(area)), ' ', '-') = ?
        AND REPLACE(LOWER(TRIM(category)), ' ', '-') = ?
      LIMIT 1
    `;

    const params = [slug, cleanedArea, cleanedCategory];

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      console.warn('Clinic not found for:', { slug, cleanedArea, cleanedCategory });
      return res.status(404).json({ message: 'Clinic not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching clinic by slug:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get clinics added by the logged-in user
exports.getClinicsByUser = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const [results] = await db.execute(
      'SELECT * FROM clinics WHERE user_id = ? ORDER BY createdAt DESC',
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching user clinics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter clinics by name, area, or type
exports.filterClinics = async (req, res) => {
  const { area, type, name } = req.query;

  let query = 'SELECT * FROM clinics WHERE 1=1';
  const params = [];

  if (area) {
    query += ' AND area LIKE ?';
    params.push(`%${area}%`);
  }

  if (type) {
    query += ' AND type LIKE ?';
    params.push(`%${type}%`);
  }

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }

  query += ' ORDER BY createdAt DESC'; // always show newest first

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error filtering clinics:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.deleteClinic = async (req, res) => {
  const clinicId = req.params.id;
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute('SELECT * FROM clinics WHERE id = ? AND user_id = ?', [clinicId, userId]);
    if (rows.length === 0) return res.status(403).json({ message: 'Unauthorized or clinic not found' });

    await db.execute('DELETE FROM clinics WHERE id = ?', [clinicId]);
    res.status(200).json({ message: 'Clinic deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting clinic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// for update 
exports.getClinicById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM clinics WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching clinic:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: Update Clinic
exports.updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      doctorName,
      qualifications,
      mobile,
      email,
      address,
      website,
      experience,
      specialization,
      area,
      category,
      description,
      type,
    } = req.body;

    // Handle uploaded images from multer
    const clinicImage = req.files?.clinicImage?.[0]?.filename || null;
    const doctorImage = req.files?.doctorImage?.[0]?.filename || null;
    const otherImage = req.files?.otherImage?.[0]?.filename || null;

    // Fetch existing record for fallback image retention
    const [existingRows] = await db.execute(
      "SELECT clinicImage, doctorImage, otherImage FROM clinics WHERE id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const existing = existingRows[0];
    const finalClinicImage = clinicImage || existing.clinicImage;
    const finalDoctorImage = doctorImage || existing.doctorImage;
    const finalOtherImage = otherImage || existing.otherImage;

    // ✅ Generate a new slug based on updated name
    const slug = generateSlug(name);

    await db.execute(
      `UPDATE clinics SET
        name = ?, slug = ?, doctorName = ?, qualifications = ?, mobile = ?, email = ?, address = ?, website = ?,
        experience = ?, specialization = ?, area = ?, category = ?, description = ?, type = ?,
        clinicImage = ?, doctorImage = ?, otherImage = ?
      WHERE id = ?`,
      [
        name,
        slug,
        doctorName,
        qualifications,
        mobile,
        email,
        address,
        website,
        experience,
        specialization,
        area,
        category,
        description,
        type,
        finalClinicImage,
        finalDoctorImage,
        finalOtherImage,
        id,
      ]
    );

    res.json({ message: "Clinic updated successfully", slug });
  } catch (err) {
    console.error("Error updating clinic:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get latest 4 clinics

// Get latest clinics
exports.getLatestClinics = async (req, res) => {
  try {
    const [clinics] = await db.execute(
      `SELECT 
         id, 
         name, 
          category, 
         area, 
         slug, 
         clinicImage AS image 
       FROM clinics 
       ORDER BY createdAt DESC 
       LIMIT 8`
    );

    const withImage = clinics.map(c => ({
      ...c,
      image: c.image?.split(',')[0] || null
    }));

    res.json(withImage);
  } catch (error) {
    console.error("❌ Error fetching latest clinics:", error.message);
    res.status(500).json({ error: "Failed to fetch latest clinics" });
  }
};







