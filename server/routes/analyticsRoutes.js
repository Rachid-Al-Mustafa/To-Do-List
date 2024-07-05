const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const {
  UserActions,
  UserAnalytic,
  TaskAnalytic,
  GetTasksByStatus,
  GetUsersByAction,
} = require('../controllers/AnalyticsController');

router.post('/analytics', verifyToken, UserActions);

router.get('/analytics/user/:id', verifyToken, UserAnalytic);

router.get('/analytics/task/:id', verifyToken, TaskAnalytic);

router.get('/tasksData', verifyToken, GetTasksByStatus);

router.get('/usersData', verifyToken, GetUsersByAction);

module.exports = router;
