const express = require('express');
const sessionController = require('../controllers/sessionController'); // Adjust path
const { validateSession, sessionValidationRules } = require('../validators/sessionValidationRules');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: API for managing sessions
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Create a new session
 *     description: Adds a new session to the system.
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - groupId
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: Valid ObjectId for the course
 *               groupId:
 *                 type: string
 *                 description: Valid ObjectId for the group
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the session (YYYY-MM-DD format)
 *               startTime:
 *                 type: string
 *                 description: Start time in HH:MM format
 *               endTime:
 *                 type: string
 *                 description: End time in HH:MM format
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     student:
 *                       type: string
 *                       description: Valid ObjectId for a student
 *                     isPresent:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/sessions', sessionValidationRules.createSession, validateSession, sessionController.createSession);

/**
 * @swagger
 * /api/sessions/{courseId}/{groupId}:
 *   get:
 *     summary: Get sessions by course and group
 *     description: Retrieves sessions for a specific course and group.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid ObjectId for the course
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid ObjectId for the group
 *     responses:
 *       200:
 *         description: List of sessions retrieved successfully
 *       404:
 *         description: No sessions found for the given course and group
 */
router.get('/sessions/:courseId/:groupId', sessionController.getSessions);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     description: Fetches details of a session by its ID.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid ObjectId for the session
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *       404:
 *         description: Session not found
 *       400:
 *         description: Invalid session ID
 */
router.get('/sessions/:id', sessionController.getSessionById);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Update a session by ID
 *     description: Updates an existing session's information.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid ObjectId for the session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 description: Updated start time in HH:MM format
 *               endTime:
 *                 type: string
 *                 description: Updated end time in HH:MM format
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     student:
 *                       type: string
 *                       description: Valid ObjectId for a student
 *                     isPresent:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       404:
 *         description: Session not found
 *       400:
 *         description: Invalid input data or session ID
 */
router.put('/sessions/:id', sessionValidationRules.updateSession, validateSession, sessionController.updateSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete a session by ID
 *     description: Deletes a session from the system.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid ObjectId for the session
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       404:
 *         description: Session not found
 *       400:
 *         description: Invalid session ID
 */
router.delete('/sessions/:id', sessionController.deleteSession);

/**
 * @swagger
 * /api/sessions/markAttendance:
 *   post:
 *     summary: Mark attendance for a session
 *     description: Updates the attendance status for a student in a session.
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - studentId
 *               - isPresent
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Valid ObjectId for the session
 *               studentId:
 *                 type: string
 *                 description: Valid ObjectId for the student
 *               isPresent:
 *                 type: boolean
 *                 description: Indicates if the student is present
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *       404:
 *         description: Session or student not found
 *       400:
 *         description: Invalid input data
 */
router.post('/sessions/markAttendance', sessionValidationRules.markAttendance, validateSession, sessionController.markAttendance);

module.exports = router;