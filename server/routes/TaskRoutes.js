const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const {
  AddTask,
  EditTask,
  DeleteTask,
  TasksList,
} = require('../controllers/TaskController');

router.post('/newTask', verifyToken, AddTask);

router.post('/editTask/:id', verifyToken, EditTask);

router.delete('/task/:id', verifyToken, DeleteTask);

router.get('/tasksList', verifyToken, TasksList);

module.exports = router;