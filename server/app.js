const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { mongoConnection } = require('./utils/mongoConnection');
const verifyToken = require('./utils/verifyToken');
const { handleError } = require('./utils/error');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.listen(process.env.PORT, () => {
  console.log('Server connected');
});

const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const TaskRoutes = require('./routes/TaskRoutes');
const AnalyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api', AuthRoutes);

app.use(verifyToken);

app.use('/api/user', UserRoutes);
app.use('/api/task', TaskRoutes);
app.use('/api/analytics', AnalyticsRoutes);

app.use(handleError);

mongoConnection;

module.exports = app;
