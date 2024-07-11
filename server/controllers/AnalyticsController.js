const UserAnalytics = require('../models/analyticsSchema');
const User = require('../models/userSchema');

const Analytics = async (req, res) => { 
  try {
    const allAnalytics = await UserAnalytics.find({}).populate('userId').populate('taskId');
    return res.status(201).json(allAnalytics);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const UserActions = async (req, res) => {
  const { userId, taskId, action } = req.body;

  if (!userId || !taskId || !action) {
    return res
      .status(400)
      .json({ message: 'User ID, Task ID, and action are required' });
  }

  try {
    if (action === 'delete' && Array.isArray(taskId)) {
      const actions = taskId.map((id) => ({
        userId,
        taskId: id,
        action,
      }));

      const savedActions = await UserAnalytics.insertMany(actions);
      return res.status(201).json(savedActions);
    }
    
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
  try {
    const users = await User.find({});
    const userTaskData = await Promise.all(
      users.map(async (user) => {
        const taskCount = await UserAnalytics.countDocuments({
          userId: user._id,
          action: 'complete',
        });
        return {
          username: user.username,
          taskCount,
        };
      })
    );

    res.status(200).json(userTaskData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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
  Analytics,
};
