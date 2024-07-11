const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { createError } = require('./../utils/error');
dotenv.config();

const Register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(createError(400, 'Username already exists! Login Instead'));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(createError(400, 'User email already exists! Login Instead'));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({ username, email, password: hashedPassword, role: req.body.role ?? 'user' });
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return next(createError(401, 'Wrong credentials'));
    
    await user.save();

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(createError(401, 'Wrong credentials'));

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      {}
    );

    user.token = token;
    await user.save();

    const { password: pass, ...others } = user._doc;
    return res.status(200).json({
      ...others,
      token,
    });
  } catch (error) {
    return next(createError(500, 'Internal Server Error'));
  }
};

const Logout = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { token: null });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  Login,
  Register,
  Logout,
};
