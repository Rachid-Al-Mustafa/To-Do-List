const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const {
  AddTask,
  EditTask,
  DeleteTask,
} = require('../controllers/TaskController');

router.post('/newTask', verifyToken, AddTask);

router.post('/editTask/:id', verifyToken, EditTask);

router.delete('/task/:id', verifyToken, DeleteTask);

module.exports = router;