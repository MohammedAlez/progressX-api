const express = require('express');
const { courseValidationRules, validateCourse } = require('../validators/courseValidationRules'); // Adjust path if necessary
const courseController = require('../controllers/courseController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Adds a new course to the system.
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacher
 *             properties:
 *               name:
 *                 type: string
 *                 description: The course name (min length 3 characters)
 *               teacher:
 *                 type: string
 *                 description: A valid ObjectId of the teacher
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of valid ObjectId file IDs
 *               groups:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of valid ObjectId group IDs
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/courses', courseValidationRules.createCourse, validateCourse, courseController.createCourse);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieves a list of all courses.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of courses
 */
router.get('/courses', courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     description: Fetches details of a course by its ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the course (valid ObjectId)
 *     responses:
 *       200:
 *         description: Successfully retrieved course
 *       404:
 *         description: Course not found
 *       400:
 *         description: Invalid course ID
 */
router.get('/courses/:id', courseValidationRules.getCourseById, validateCourse, courseController.getCourseById);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course by ID
 *     description: Updates the information of an existing course.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the course (valid ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated course name
 *               teacher:
 *                 type: string
 *                 description: Updated teacher ID
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Updated array of file IDs
 *               groups:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Updated array of group IDs
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Invalid input data or ID
 *       404:
 *         description: Course not found
 */
router.put('/courses/:id', courseValidationRules.updateCourse, validateCourse, courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     description: Deletes a course based on its ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the course (valid ObjectId)
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       400:
 *         description: Invalid course ID
 */
router.delete('/courses/:id', courseValidationRules.deleteCourse, validateCourse, courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/addFile:
 *   post:
 *     summary: Add a file to a course
 *     description: Associates a file with a specific course.
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The course ID to add the file to
 *               fileId:
 *                 type: string
 *                 description: The file ID to be added to the course
 *     responses:
 *       200:
 *         description: File added to course successfully
 *       404:
 *         description: Course or file not found
 *       400:
 *         description: Invalid course or file ID
 */
router.post('/courses/addFile', courseController.addFileToCourse);

/**
 * @swagger
 * /course/{courseId}/progress:
 *   get:
 *     summary: Get course progress
 *     description: Retrieves the progress of a course as a percentage of total sessions' time taken over the total course time.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the course (valid ObjectId).
 *     responses:
 *       200:
 *         description: Successfully retrieved course progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                   description: The unique ID of the course.
 *                 progress:
 *                   type: string
 *                   description: Course progress percentage (e.g., "45%").
 *       404:
 *         description: Course not found
 *       400:
 *         description: Invalid course ID
 *       500:
 *         description: Internal server error
 */
router.get('/course/:courseId/progress', courseValidationRules.getCourseProgress, validateCourse, courseController.getCourseProgress);

module.exports = router;