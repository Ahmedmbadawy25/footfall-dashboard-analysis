const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectName: {
        type: String,
        required: true,
        unique: true
    },
    logoUrl: {
        type: String
    },
    tagline: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);
