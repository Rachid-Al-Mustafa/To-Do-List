const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const {
  AddTask,
  EditTask,
  DeleteTask,
  TasksList,
  UpdateTaskStatus,
  getTaskAnalytics,
} = require('../controllers/TaskController');

router.get('/getTaskAnalytics', verifyToken, getTaskAnalytics);

router.post('/newTask', verifyToken, AddTask);

router.post('/editTask/:id', verifyToken, EditTask);

router.post('/removeTasks', verifyToken, DeleteTask);

router.get('/tasksList', verifyToken, TasksList);

router.post('/updateStatus', UpdateTaskStatus);

module.exports = router;