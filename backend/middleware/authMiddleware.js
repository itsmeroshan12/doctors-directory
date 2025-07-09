const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded JWT payload:', decoded); // 🔍 Log it!
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticateJWT;
