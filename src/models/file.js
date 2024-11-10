const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true } // Course the file belongs to
}, { timestamps: true });

const File = mongoose.model('File', FileSchema);
module.exports = File;