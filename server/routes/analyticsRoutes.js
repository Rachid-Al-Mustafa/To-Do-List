const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const {
  UserActions,
  UserAnalytic,
  TaskAnalytic,
  GetTasksByStatus,
  GetUsersByAction,
  Analytics,
} = require('../controllers/AnalyticsController');

router.get('/dataAnalytics', verifyToken, Analytics);

router.post('/analytics', verifyToken, UserActions);

router.get('/userTasks', verifyToken, UserAnalytic);

router.get('/analytics/task/:id', verifyToken, TaskAnalytic);

router.get('/tasksData', verifyToken, GetTasksByStatus);

router.get('/usersData', verifyToken, GetUsersByAction);

module.exports = router;
