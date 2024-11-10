const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    sessionTime: {
        type: Number, // Calculated session time in minutes or hours
        default: function () {
            return (this.endTime - this.startTime) / (1000 * 60); // Minutes
        }
    },
    attendance: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        isPresent: { type: Boolean, required: true }
    }]
}, { timestamps: true });

// Virtual to calculate duration in hours
SessionSchema.virtual('duration').get(function () {
    return (new Date(this.endTime) - new Date(this.startTime)) / (1000 * 60 * 60); // duration in hours
});

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;  