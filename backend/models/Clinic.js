const db = require('../config/db');
const slugify = require('slugify');

// Create a new clinic
exports.createClinic = async ({
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
  user_id
}) => {
  const slug = slugify(name, { lower: true, strict: true });
  

  const [result] = await db.execute(
    `INSERT INTO clinics 
    (name, type, area, slug, doctorName, qualifications, mobile, email, address, website, 
     experience, specialization, category, description, clinicImage, doctorImage, otherImage, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      type,
      area,
      slug,
      doctorName,
      qualifications,
      mobile,
      email,
      address,
      website,
      experience,
      specialization,
      category,
      description,
      clinicImage,
      doctorImage,
      otherImage,
      user_id // ✅ fixed variable name
    ]
  );

  return { id: result.insertId, name, slug };
};

// Get clinic by slug, type, and area
exports.getClinicBySlug = async ({ slug, type, area }) => {
  const [rows] = await db.execute(
    'SELECT * FROM clinics WHERE slug = ? AND LOWER(type) = ? AND LOWER(area) = ? LIMIT 1',
    [slug, type.toLowerCase(), area.toLowerCase()]
  );
  return rows[0];
};

// Filter clinics
exports.filterClinics = async ({ name, type, area }) => {
  let query = 'SELECT * FROM clinics WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (type) {
    query += ' AND LOWER(type) = ?';
    params.push(type.toLowerCase());
  }
  if (area) {
    query += ' AND LOWER(area) = ?';
    params.push(area.toLowerCase());
  }

  const [rows] = await db.execute(query, params);
  return rows;
};
