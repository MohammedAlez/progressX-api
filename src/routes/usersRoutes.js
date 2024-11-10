const express = require('express');
const { userValidationRules, validateUser } = require('../validators/userValidationRules'); // Adjust path
const userController = require('../controllers/usersController');
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the user.
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *                 description: Role of the user.
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Validation error.
 */
router.post('/users', userValidationRules().createUser, validateUser, userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found.
 *       404:
 *         description: User not found.
 */
router.get('/users/:id', userValidationRules().getUserById, validateUser, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Validation error.
 */
router.put('/users/:id', userValidationRules().updateUser, validateUser, userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete('/users/:id', userValidationRules().deleteUser, validateUser, userController.deleteUser);

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     summary: Get users by role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, teacher, admin]
 *         required: true
 *         description: Role of the users
 *     responses:
 *       200:
 *         description: List of users with the specified role.
 *       404:
 *         description: Users not found.
 */
router.get('/users/role/:role', userValidationRules().getUsersByRole, validateUser, userController.getUsersByRole);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Invalid credentials.
 */
router.post('/users/login', userValidationRules().login, validateUser, userController.login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Fetches a list of all registered users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique ID of the user.
 *                   name:
 *                     type: string
 *                     description: The user's full name.
 *                   email:
 *                     type: string
 *                     description: The user's email address.
 *                   role:
 *                     type: string
 *                     description: User's role (e.g., "student", "teacher", "admin").
 *       500:
 *         description: Internal server error
 */
router.get('/users',userController.getAllUsers);

module.exports = router;