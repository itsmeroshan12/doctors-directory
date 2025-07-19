const db = require('../config/db');

// 🔧 Helper to generate SEO slug: dr-krishna-thalagavara-psychiatrist
const generateSlug = (name, category) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') +
  '-' +
  category.toLowerCase().replace(/\s+/g, '-');


// ✅ Create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    console.log('🩺 Creating Doctor by user:', req.user?.userId);
    console.table(req.body);

    const {
      name,
      specialization,
      area,
      category,
      type,
      description,
      languagesSpoken,
      experienceYears,
      qualifications,
      mobile,
      email,
      address,
    } = req.body;

    const user_id = req.user?.userId || null;

    // ✅ Basic validation
    if (!name || !category || !area || !specialization) {
      return res.status(400).json({ message: 'Name, category, area, and specialization are required' });
    }

    const slug = generateSlug(name, category);
    const createdAt = new Date();
    const updatedAt = new Date();

    // ✅ File uploads via multer
    const doctorImage = req.files?.doctorImage?.[0]?.filename || null;
    const clinicImage = req.files?.clinicImage?.[0]?.filename || null;
    const otherImage = req.files?.otherImage?.[0]?.filename || null;

    const values = [
      name,
      doctorImage,
      clinicImage,
      otherImage,
      specialization,
      area,
      category,
      type,
      description,
      languagesSpoken,
      experienceYears,
      qualifications,
      mobile,
      email,
      address,
      slug,
      createdAt,
      updatedAt,
      user_id,
    ];

    const [result] = await db.execute(
      `INSERT INTO doctors 
      (name, doctorImage, clinicImage, otherImage, specialization, area, category, type, description, languagesSpoken, experienceYears, qualifications, mobile, email, address, slug, createdAt, updatedAt, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      area,
      category,
      doctorImage,
      clinicImage,
      otherImage,
    });
  } catch (error) {
    console.error('❌ Error creating doctor:', error);
    res.status(500).json({ message: error.message });
  }
};



// ✅ Get doctor by slug and category
exports.getDoctorBySlug = async (req, res) => {
  const { category = '', slug = '' } = req.params;

  try {
    const cleanedCategory = category.toLowerCase().trim().replace(/\s+/g, '-');

    const [rows] = await db.execute(
      `SELECT * FROM doctors 
       WHERE slug = ?
       AND REPLACE(LOWER(TRIM(category)), ' ', '-') = ?
       LIMIT 1`,
      [slug, cleanedCategory]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching doctor by slug:', error);
    res.status(500).json({ error: error.message });
  }
};



// ✅ Get doctors added by the logged-in user
exports.getDoctorsByUser = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const [results] = await db.execute(
      'SELECT * FROM doctors WHERE user_id = ? ORDER BY createdAt DESC',
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching user doctors:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// ✅ Filter doctors by area, category, or name
exports.filterDoctors = async (req, res) => {
  const { area, category, name } = req.query;

  let query = 'SELECT * FROM doctors WHERE 1=1';
  const params = [];

  if (area) {
    query += ' AND area LIKE ?';
    params.push(`%${area}%`);
  }

  if (category) {
    query += ' AND category LIKE ?';
    params.push(`%${category}%`);
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
    console.error('❌ Error filtering doctors:', error);
    res.status(500).json({ error: error.message });
  }
};

// delete a doctor

exports.deleteDoctor = async (req, res) => {
  const doctorId = req.params.id;
  const userId = req.user.userId;

  try {
    const [rows] = await db.execute('SELECT * FROM doctors WHERE id = ? AND user_id = ?', [doctorId, userId]);
    if (rows.length === 0) return res.status(403).json({ message: 'Unauthorized or doctor not found' });

    await db.execute('DELETE FROM doctors WHERE id = ?', [doctorId]);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting doctor:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET doctor by ID (for editing)
exports.getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM doctors WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching doctor by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



// PUT update doctor
const slugify = require("slugify");

exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      area,
      category,
      specialization,
      experienceYears,
      type,
      qualifications,
      languagesSpoken,
      address,
      description,
      mobile,
      email,
    } = req.body;

    const safe = (value) => (value === undefined ? null : value);

    const doctorImage = req.files?.doctorImage?.[0]?.filename || null;
    const clinicImage = req.files?.clinicImage?.[0]?.filename || null;
    const otherImage = req.files?.otherImage?.[0]?.filename || null;

    // Fetch current doctor record
    const [existingRows] = await db.execute(
      "SELECT name, doctorImage, clinicImage, otherImage FROM doctors WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const existing = existingRows[0];

    const finalDoctorImage = doctorImage || existing.doctorImage;
    const finalClinicImage = clinicImage || existing.clinicImage;
    const finalOtherImage = otherImage || existing.otherImage;

    let slug = existing.slug;

    // If name changed, regenerate slug
    if (name && name !== existing.name) {
      const baseSlug = slugify(name, { lower: true, strict: true });

      // Check for existing slugs
      const [slugCheck] = await db.execute(
        "SELECT COUNT(*) AS count FROM doctors WHERE slug = ? AND id != ?",
        [baseSlug, id]
      );

      if (slugCheck[0].count === 0) {
        slug = baseSlug;
      } else {
        // Try slug-1, slug-2, ... until unique
        let suffix = 1;
        let newSlug = `${baseSlug}-${suffix}`;
        let [conflict] = await db.execute(
          "SELECT COUNT(*) AS count FROM doctors WHERE slug = ? AND id != ?",
          [newSlug, id]
        );

        while (conflict[0].count > 0) {
          suffix++;
          newSlug = `${baseSlug}-${suffix}`;
          [conflict] = await db.execute(
            "SELECT COUNT(*) AS count FROM doctors WHERE slug = ? AND id != ?",
            [newSlug, id]
          );
        }

        slug = newSlug;
      }
    }

    const sql = `
      UPDATE doctors SET
        name = ?, area = ?, category = ?, specialization = ?, experienceYears = ?, type = ?,
        qualifications = ?, languagesSpoken = ?, address = ?, description = ?, 
        mobile = ?, email = ?, doctorImage = ?, clinicImage = ?, otherImage = ?, slug = ?
      WHERE id = ?
    `;

    const updateValues = [
      safe(name), safe(area), safe(category), safe(specialization), safe(experienceYears), safe(type),
      safe(qualifications), safe(languagesSpoken), safe(address), safe(description),
      safe(mobile), safe(email), safe(finalDoctorImage), safe(finalClinicImage), safe(finalOtherImage),
      safe(slug), id
    ];

    await db.execute(sql, updateValues);

    res.json({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




// listing for the homepage 
exports.getLatestDoctors = async (req, res) => {
  try {
    const [doctors] = await db.execute(
      'SELECT id, name, category, slug, area, doctorImage AS image FROM doctors ORDER BY createdAt DESC LIMIT 8'
    );

    const withImage = doctors.map(d => ({
      ...d,
      image: d.image?.split(',')[0] || null
    }));

    res.json(withImage);
  } catch (error) {
    console.error("❌ Error fetching latest doctors:", error.message);
    res.status(500).json({ error: "Failed to fetch latest doctors" });
  }
};




