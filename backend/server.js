const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config()
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

connectDB()

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/users', require('./routes/User'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, error => {
  if (error)
    console.error(error);
  console.log('Server listening on port', PORT)
})