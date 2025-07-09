const db = require('../config/db');

// Helper to generate a URL-friendly slug
const generateSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + Date.now();

// ✅ Create a new hospital
exports.createHospital = async (req, res) => {
  try {
    console.log('🆕 Creating Hospital for user:', req.user?.userId);
    console.table(req.body);

    const {
      name,
      mobile,
      email,
      address,
      website,
      area,
      category,
      description,
      type,
    } = req.body;

    const user_id = req.user?.userId || null;

    if (!name || !type || !area) {
      return res.status(400).json({ message: 'Name, type, and area are required' });
    }

    const slug = generateSlug(name);
    const hospitalImage = req.files?.hospitalImage?.[0]?.filename || null;
    const otherImage = req.files?.otherImage?.[0]?.filename || null;

    const createdAt = new Date();
    const updatedAt = new Date();

    const values = [
      name,
      mobile,
      email,
      address,
      website,
      area,
      category,
      description,
      type,
      hospitalImage,
      otherImage,
      slug,
      createdAt,
      updatedAt,
      user_id,
    ];

    const [result] = await db.execute(
      `INSERT INTO hospitals 
      (name, mobile, email, address, website, area, category, description, type, hospitalImage, otherImage, slug, createdAt, updatedAt, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      area,
      type,
      hospitalImage,
      otherImage,
    });
  } catch (error) {
    console.error('❌ Error adding hospital:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get hospital by slug, area, and category
exports.getHospitalBySlug = async (req, res) => {
  const { slug = '', area = '', category = '' } = req.params;

  try {
    const cleanedArea = area.toLowerCase().trim().replace(/\s+/g, '-');
    const cleanedCategory = category.toLowerCase().trim().replace(/\s+/g, '-');

    const query = `
      SELECT * FROM hospitals 
      WHERE slug = ?
        AND REPLACE(LOWER(TRIM(area)), ' ', '-') = ?
        AND REPLACE(LOWER(TRIM(category)), ' ', '-') = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [slug, cleanedArea, cleanedCategory]);

    if (rows.length === 0) {
      console.warn('Hospital not found for:', { slug, cleanedArea, cleanedCategory });
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching hospital by slug:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get hospitals added by the logged-in user
exports.getHospitalsByUser = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const [results] = await db.execute(
      'SELECT * FROM hospitals WHERE user_id = ? ORDER BY createdAt DESC',
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching user hospitals:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Filter hospitals by name, area, or type
exports.filterHospitals = async (req, res) => {
  const { area, type, name } = req.query;

  let query = 'SELECT * FROM hospitals WHERE 1=1';
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

  query += ' ORDER BY createdAt DESC';

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error filtering hospitals:', error);
    res.status(500).json({ error: error.message });
  }
};

// delete a hospital
exports.deleteHospital = async (req, res) => {
  const hospitalId = req.params.id;
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute('SELECT * FROM hospitals WHERE id = ? AND user_id = ?', [hospitalId, userId]);
    if (rows.length === 0) {
      return res.status(403).json({ message: 'Unauthorized or hospital not found' });
    }

    await db.execute('DELETE FROM hospitals WHERE id = ?', [hospitalId]);

    res.status(200).json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    console.error('Error deleting hospital:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//update a hospital
exports.getHospitalById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM hospitals WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching hospital by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;

    // Multer will give you form fields in req.body
    const { name, area, category, type, description, address, mobile, email, website } = req.body;

    // Handle uploaded files (if any)
    const hospitalImage = req.files?.hospitalImage?.[0]?.filename || null;
    const otherImage = req.files?.otherImage?.[0]?.filename || null;

    // Fetch existing data to preserve unchanged images
    const [existingRows] = await db.execute("SELECT hospitalImage, otherImage FROM hospitals WHERE id = ?", [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const existing = existingRows[0];

    const finalHospitalImage = hospitalImage || existing.hospitalImage;
    const finalOtherImage = otherImage || existing.otherImage;

    // Run the update
    await db.execute(
      `UPDATE hospitals 
       SET name = ?, area = ?, category = ?, type = ?, description = ?, address = ?, mobile = ?, email = ?, website = ?, hospitalImage = ?, otherImage = ?
       WHERE id = ?`,
      [
        name,
        area,
        category,
        type,
        description,
        address,
        mobile,
        email,
        website,
        finalHospitalImage,
        finalOtherImage,
        id,
      ]
    );

    res.json({ message: "Hospital updated successfully" });
  } catch (err) {
    console.error("Error updating hospital:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get latest hospitals
// Get latest hospitals
exports.getLatestHospitals = async (req, res) => {
  try {
    const [hospitals] = await db.execute(
      `SELECT 
         id, 
         name, 
         category,      
         area, 
         slug, 
         hospitalImage AS image 
       FROM hospitals 
       ORDER BY createdAt DESC 
       LIMIT 8`
    );

    const withImage = hospitals.map(h => ({
      ...h,
      image: h.image?.split(',')[0] || null
    }));

    res.json(withImage);
  } catch (error) {
    console.error("❌ Error fetching latest hospitals:", error.message);
    res.status(500).json({ error: "Failed to fetch latest hospitals" });
  }
};








