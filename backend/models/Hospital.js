const db = require('../config/db');
const slugify = require('slugify');

// ✅ Create a new hospital
exports.createHospital = async ({
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
  user_id
}) => {
  const slug = slugify(name, { lower: true, strict: true });

  const [result] = await db.execute(
    `INSERT INTO hospitals 
    (name, type, area, slug, mobile, email, address, website, 
     category, description, hospitalImage, otherImage, user_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      type,
      area,
      slug,
      mobile,
      email,
      address,
      website,
      category,
      description,
      hospitalImage,
      otherImage,
      user_id
    ]
  );

  return { id: result.insertId, name, slug };
};

// ✅ Get hospital by slug, type, and area
exports.getHospitalBySlug = async ({ slug, type, area }) => {
  const [rows] = await db.execute(
    'SELECT * FROM hospitals WHERE slug = ? AND LOWER(type) = ? AND LOWER(area) = ? LIMIT 1',
    [slug, type.toLowerCase(), area.toLowerCase()]
  );
  return rows[0];
};

// ✅ Filter hospitals by optional name, type, area
exports.filterHospitals = async ({ name, type, area }) => {
  let query = 'SELECT * FROM hospitals WHERE 1=1';
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

// ✅ Get hospitals by user
exports.getHospitalsByUser = async (user_id) => {
  const [rows] = await db.execute(
    'SELECT * FROM hospitals WHERE user_id = ? ORDER BY createdAt DESC',
    [user_id]
  );
  return rows;
};
