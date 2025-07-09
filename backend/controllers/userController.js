const db = require('../config/db');

exports.getAllUserListings = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [doctors] = await db.execute('SELECT *, "doctor" as listingType FROM doctors WHERE user_id = ?', [userId]);
    const [clinics] = await db.execute('SELECT *, "clinic" as listingType FROM clinics WHERE user_id = ?', [userId]);
    const [hospitals] = await db.execute(
      'SELECT *, "hospital" as listingType FROM hospitals WHERE user_id = ?',
      [userId]
    );

    const allListings = [...doctors, ...clinics, ...hospitals];

    res.json(allListings);
  } catch (err) {
    console.error('❌ Error fetching all user listings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
