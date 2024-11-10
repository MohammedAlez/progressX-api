const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/file');
const Course = require('../models/course');

// ------------------------------------ multer config --------------------------------------------- //
// Default upload settings
const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5 MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];  // Add more as needed

// Multer storage configuration
const getStorage = (section) => multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, `../public/uploads/${section}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for allowed extensions
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        cb(new Error(`Only the following file types are allowed: ${ALLOWED_EXTENSIONS.join(', ')}`));
    } else {
        cb(null, true);
    }
};

// Upload middleware
const uploadMiddleware = (section) => multer({
    storage: getStorage(section),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
}).single('file');
// ------------------------------------ multer config --------------------------------------------- //

// Upload controller
exports.uploadFile = async (req, res) => {
    const { section, courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Set up and run upload process
    uploadMiddleware(section)(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        // Generate file paths
        const fileUri = `${req.protocol}://${req.get('host')}/uploads/${section}/${req.file.filename}`;

        // Save file to the database
        const fileObject = new File({
            filename: req.file.filename,
            filePath: fileUri,
            section,
            course: courseId
        });
        await fileObject.save();

        // Return response without filesystem path
        res.status(200).json({
            message: 'File uploaded successfully',
            data: {
                fileUri: fileObject.filePath,
                section: fileObject.section,
                uploadedAt: fileObject.createdAt,
                _id: fileObject._id,
                course: fileObject.course
            }
        });
    });
};

// Get all files for a specific course
exports.getFilesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Retrieve files related to the course
        const files = await File.find({ course: courseId });

        if (!files.length) {
            return res.status(404).json({ message: 'No files found for this course' });
        }

        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single file by ID
exports.getFileById = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a file by ID
exports.updateFile = async (req, res) => {
    try {
        const { filename, filePath, courseId } = req.body;

        // Check if the course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update file details
        const updatedFile = await File.findByIdAndUpdate(
            req.params.id,
            { filename, filePath, course: courseId },
            { new: true }
        );

        if (!updatedFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json(updatedFile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a file by ID
exports.deleteFile = async (req, res) => {
    try {
        const deletedFile = await File.findByIdAndDelete(req.params.id);

        if (!deletedFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};