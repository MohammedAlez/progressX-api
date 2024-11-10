const express = require('express');
const fileController = require('../controllers/fileController'); // Adjust path
const router = express.Router();

// Route to create a new file for a course
router.post('/courses/:courseId/files', fileController.uploadFile);

// Route to get all files for a specific course
router.get('/courses/:courseId/files', fileController.getFilesByCourse);

// Route to get a specific file by its ID
router.get('/files/:id', fileController.getFileById);

// Route to update a file by its ID
router.put('/files/:id', fileController.updateFile);

// Route to delete a file by its ID
router.delete('/files/:id', fileController.deleteFile);

module.exports = router;