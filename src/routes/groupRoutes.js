const express = require('express');
const groupController = require('../controllers/groupController'); // Adjust path
const { groupValidationRules , validateGroup } = require('../validators/groupValidationRules');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API for managing groups
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     description: Adds a new group to the system.
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the group
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of valid ObjectId references for students
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of valid ObjectId references for courses
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/groups', groupValidationRules.createGroup, validateGroup, groupController.createGroup);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     description: Retrieves a list of all groups.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of groups
 */
router.get('/groups', groupController.getAllGroups);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get a group by ID
 *     description: Fetches details of a group by its ID.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the group (valid ObjectId)
 *     responses:
 *       200:
 *         description: Successfully retrieved group
 *       404:
 *         description: Group not found
 *       400:
 *         description: Invalid group ID
 */
router.get('/groups/:id', groupController.getGroupById);

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update a group by ID
 *     description: Updates the information of an existing group.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the group (valid ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the group
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Updated array of student IDs
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Updated array of course IDs
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Invalid input data or ID
 *       404:
 *         description: Group not found
 */
router.put('/groups/:id', groupValidationRules.updateGroup, groupController.updateGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group by ID
 *     description: Deletes a group based on its ID.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the group (valid ObjectId)
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 *       400:
 *         description: Invalid group ID
 */
router.delete('/groups/:id', groupController.deleteGroup);

/**
 * @swagger
 * /api/groups/addStudent:
 *   post:
 *     summary: Add a student to a group
 *     description: Associates a student with a specific group.
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - studentId
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: The ID of the group to add the student to
 *               studentId:
 *                 type: string
 *                 description: The ID of the student to be added
 *     responses:
 *       200:
 *         description: Student added to group successfully
 *       404:
 *         description: Group or student not found
 *       400:
 *         description: Invalid group or student ID
 */
router.post('/groups/addStudent', groupController.addStudentToGroup);

/**
 * @swagger
 * /api/groups/addCourse:
 *   post:
 *     summary: Add a course to a group
 *     description: Associates a course with a specific group.
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - courseId
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: The ID of the group to add the course to
 *               courseId:
 *                 type: string
 *                 description: The ID of the course to be added
 *     responses:
 *       200:
 *         description: Course added to group successfully
 *       404:
 *         description: Group or course not found
 *       400:
 *         description: Invalid group or course ID
 */
router.post('/groups/addCourse', groupController.addCourseToGroup);

module.exports = router;