const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Validation rules for group creation and updating
const groupValidationRules = {
    createGroup: [
        body('name')
            .notEmpty()
            .withMessage('Group name is required')
            .isString()
            .withMessage('Group name must be a string'),

        body('students')
            .optional()
            .isArray()
            .withMessage('Students must be an array of ObjectId references')
            .custom((students) => students.every(student => mongoose.Types.ObjectId.isValid(student)))
            .withMessage('All students must be valid ObjectId references'),

        body('courses')
            .optional()
            .isArray()
            .withMessage('Courses must be an array of ObjectId references')
            .custom((courses) => courses.every(course => mongoose.Types.ObjectId.isValid(course)))
            .withMessage('All courses must be valid ObjectId references'),
    ],

    updateGroup: [
        param('id')
            .isMongoId()
            .withMessage('Invalid group ID'),

        body('name')
            .optional()
            .isString()
            .withMessage('Group name must be a string'),

        body('students')
            .optional()
            .isArray()
            .withMessage('Students must be an array of ObjectId references')
            .custom((students) => students.every(student => mongoose.Types.ObjectId.isValid(student)))
            .withMessage('All students must be valid ObjectId references'),

        body('courses')
            .optional()
            .isArray()
            .withMessage('Courses must be an array of ObjectId references')
            .custom((courses) => courses.every(course => mongoose.Types.ObjectId.isValid(course)))
            .withMessage('All courses must be valid ObjectId references'),
    ]
};

// Apply validation and handle errors
const validateGroup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { groupValidationRules , validateGroup };