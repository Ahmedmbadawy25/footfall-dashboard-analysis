const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;