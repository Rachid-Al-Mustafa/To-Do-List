const User = require('../models/userSchema');

const EditProfile = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'No data provided for update' });
  }

  const userId = req.user.id;

  try {
    const { username, email, password } = req.body;

    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: updatedFields,
      },
      { new: true, lean: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const changeUserRole = async (req, res, next) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole || !['user', 'teamLeader'].includes(newRole)) {
    return res.status(400).json({ message: 'Invalid user ID or role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({ message: `User role updated to ${newRole}` });
  } catch (error) {
    return next(createError(500, 'Internal server error'));
  }
};

module.exports = {
  EditProfile,
  changeUserRole,
};
