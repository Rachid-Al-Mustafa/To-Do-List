const Task = require('../models/taskSchema');

const AddTask = async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ message: 'Title and User ID are required' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const EditTask = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'No data provided for update' });
  }

  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('userId');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const DeleteTask = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: 'Invalid request. No task IDs provided.' });
  }

  try {
    const result = await Task.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No tasks found to delete.' });
    }

    return res
      .status(200)
      .json({
        message: 'Tasks deleted successfully',
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const TasksList = async (req, res) => { 
  try {
    const tasks = await Task.find().populate('userId');
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const UpdateTaskStatus = async (req, res) => {
  const { taskId, newStatus } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isCompleted: newStatus, completedAt: newStatus ? new Date() : null },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res
      .status(200)
      .json({ message: 'Task status updated successfully', task: updatedTask });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({});

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const completionRate = (completedTasks / totalTasks) * 100;

    const timeline = tasks
      .filter((task) => task.isCompleted)
      .reduce((acc, task) => {
        const date = task.completedAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

    res
      .status(200)
      .json({ totalTasks, completedTasks, completionRate, timeline });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  AddTask,
  EditTask,
  DeleteTask,
  TasksList,
  UpdateTaskStatus,
  getTaskAnalytics
};
