const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    totalDuration: { type: Number, required: true } // in hours, total duration of the course
  }, { timestamps: true });  

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;  