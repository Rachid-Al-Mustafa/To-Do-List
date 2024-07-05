const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const { createError } = require('../utils/error');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(createError(403, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user || user.token !== token) {
      return next(createError(401, 'Unauthorized'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createError(401, 'Unauthorized'));
  }
};

module.exports = verifyToken;