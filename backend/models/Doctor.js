const db = require('../config/db');
const slugify = require('slugify');

// ✅ Create a new doctor
exports.createDoctor = async ({
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
  user_id,
}) => {
  const slug = slugify(`${name}-${category}`, { lower: true, strict: true });
  const createdAt = new Date();
  const updatedAt = new Date();

  const [result] = await db.execute(
    `INSERT INTO doctors 
    (name, doctorImage, clinicImage, otherImage, specialization, area, category, type, 
     description, languagesSpoken, experienceYears, qualifications, mobile, email, address, 
     slug, createdAt, updatedAt, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
      user_id
    ]
  );

  return { id: result.insertId, name, slug };
};


// ✅ Get doctor by slug and category
exports.getDoctorBySlug = async ({ slug, category }) => {
  const [rows] = await db.execute(
    `SELECT * FROM doctors 
     WHERE slug = ? AND LOWER(category) = ? LIMIT 1`,
    [slug, category.toLowerCase()]
  );
  return rows[0];
};


// ✅ Get doctors added by user
exports.getDoctorsByUser = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM doctors 
     WHERE user_id = ? ORDER BY createdAt DESC`,
    [userId]
  );
  return rows;
};


// ✅ Filter doctors
exports.filterDoctors = async ({ name, area, category }) => {
  let query = 'SELECT * FROM doctors WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }

  if (area) {
    query += ' AND LOWER(area) = ?';
    params.push(area.toLowerCase());
  }

  if (category) {
    query += ' AND LOWER(category) = ?';
    params.push(category.toLowerCase());
  }

  query += ' ORDER BY createdAt DESC';

  const [rows] = await db.execute(query, params);
  return rows;
};
