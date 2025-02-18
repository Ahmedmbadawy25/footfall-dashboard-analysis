const mongoose = require('mongoose');

const footfallSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true, // Optimized for time-based queries
  },
  event_type: {
    type: String,
    enum: ["entry", "exit"],
    required: true,
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    index: true,
  },
  hour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  day: {
    type: String,
    required: true,
  },
  day_of_month: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
  },  
  week: {
    type: Number,
    required: true,
    min: 1,
    max: 53,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Footfall', footfallSchema);

