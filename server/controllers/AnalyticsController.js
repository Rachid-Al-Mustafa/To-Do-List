const UserAnalytics = require('../models/analyticsSchema');

const UserActions = async (req, res) => {
  const { userId, taskId, action } = req.body;

  if (!userId || !taskId || !action) {
    return res
      .status(400)
      .json({ message: 'User ID, Task ID, and action are required' });
  }

  try {
    const newUserAction = new UserAnalytics({
      userId,
      taskId,
      action,
    });

    const savedUserAction = await newUserAction.save();
    return res.status(201).json(savedUserAction);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const UserAnalytic = async (req, res) => {
  const { id } = req.params;

  try {
    const userActions = await UserAnalytics.find({ userId: id })
      .populate('taskId')
      .populate('userId');
    return res.status(200).json(userActions);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const TaskAnalytic = async (req, res) => {
  const { id } = req.params;

  try {
    const taskActions = await UserAnalytics.find({ taskId: id })
      .populate('taskId')
      .populate('userId');
    return res.status(200).json(taskActions);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const GetTasksByStatus = async (req, res) => {
  const { action } = req.query;

  if (!action) {
    return res
      .status(400)
      .json({ message: 'Action query parameter is required' });
  }

  try {
    const analytics = await UserAnalytics.find({ action });

    const taskIds = analytics.map((record) => record.taskId);

    const tasks = await Task.find({ _id: { $in: taskIds } });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const GetUsersByAction = async (req, res) => {
  const { action } = req.query;

  if (!action) {
    return res
      .status(400)
      .json({ message: 'Action query parameter is required' });
  }

  try {
    const analytics = await UserAnalytics.find({ action });

    const userIds = analytics.map((record) => record.userId);

    const users = await User.find({ _id: { $in: userIds } });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  UserActions,
  UserAnalytic,
  TaskAnalytic,
  GetTasksByStatus,
  GetUsersByAction,
};
