const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Create new user with no token stored
const createUser = async (user) => {
  const { firstName, lastName, phone, email, password } = user;
  await db.execute(
    'INSERT INTO users (firstName, lastName, phone, email, password, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
    [firstName, lastName, phone, email, password, false]
  );
};

// Find user by email
const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

// Find user by id
const findUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

// Mark user as verified
const verifyUserEmail = async (userId) => {
  await db.execute(
    'UPDATE users SET is_verified = ? WHERE id = ?',
    [true, userId]
  );
};

// Update user password
const updateUserPassword = async (userId, hashedPassword) => {
  await db.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, userId]
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyUserEmail,
  updateUserPassword, // ✅ Add this for resetPassword controller
};
