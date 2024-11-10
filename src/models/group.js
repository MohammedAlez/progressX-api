const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Students in the group
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Courses the group is taking
}, { timestamps: true });

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;