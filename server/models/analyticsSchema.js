const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAnalyticsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  action: {
    type: String,
    enum: ['create', 'edit', 'complete', 'delete'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserAnalytics', UserAnalyticsSchema);
