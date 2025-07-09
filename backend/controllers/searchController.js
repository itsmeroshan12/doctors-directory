const db = require('../config/db'); // your mysql2 connection

exports.searchListings = async (req, res) => {
  const { area, category, specialty } = req.query;

  try {
    let sql = '';
    let params = [];

    if (category === 'doctor') {
      sql = `SELECT * FROM doctors WHERE 1=1`;
      if (area) {
        sql += ` AND LOWER(area) = LOWER(?)`;
        params.push(area);
      }
      if (specialty) {
        sql += ` AND LOWER(specialty) = LOWER(?)`;
        params.push(specialty);
      }
    } else if (category === 'clinic') {
      sql = `SELECT * FROM clinics WHERE 1=1`;
      if (area) {
        sql += ` AND LOWER(area) = LOWER(?)`;
        params.push(area);
      }
      if (specialty) {
        sql += ` AND LOWER(type) = LOWER(?)`;
        params.push(specialty);
      }
    } else if (category === 'hospital') {
      sql = `SELECT * FROM hospitals WHERE 1=1`;
      if (area) {
        sql += ` AND LOWER(area) = LOWER(?)`;
        params.push(area);
      }
    } else {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Execute the query
    const [results] = await db.execute(sql, params);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
