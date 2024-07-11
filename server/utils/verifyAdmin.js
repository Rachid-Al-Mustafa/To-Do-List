const User = require('../models/userSchema');
const { createError } = require('../utils/error');

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role === 'user') {
      return next(
        createError(403 + 'Access denied: Super Admins and Admins only')
      );
    }
    next();
  } catch (error) {
    return next(createError(500 + 'Internal server error'));
  }
};

module.exports = verifyAdmin;
