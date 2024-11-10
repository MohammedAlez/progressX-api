const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Validation rules for session creation and updates
const sessionValidationRules = {
    // Validation for creating a new session
    createSession: [
        // Validate courseId: it must be a valid ObjectId
        body('courseId')
            .notEmpty()
            .withMessage('courseId is required')
            .isMongoId()
            .withMessage('Invalid courseId'),

        // Validate groupId: it must be a valid ObjectId
        body('groupId')
            .notEmpty()
            .withMessage('groupId is required')
            .isMongoId()
            .withMessage('Invalid groupId'),

        // Validate date: it must be a valid date in YYYY-MM-DD format
        body('date')
            .notEmpty()
            .withMessage('date is required')
            .isDate()
            .withMessage('Invalid date format, should be YYYY-MM-DD'),

        // Validate startTime and endTime: must be in HH:MM format
        body('startTime')
            .notEmpty()
            .withMessage('startTime is required')
            .matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
            .withMessage('startTime must be a valid time in HH:MM format'),

        body('endTime')
            .notEmpty()
            .withMessage('endTime is required')
            .matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
            .withMessage('endTime must be a valid time in HH:MM format'),

        // Validate attendance: it must be an array of objects containing student ObjectIds
        body('attendance')
            .optional()
            .isArray()
            .withMessage('attendance must be an array')
            .custom((attendance) => attendance.every(att => mongoose.Types.ObjectId.isValid(att.student)))
            .withMessage('Each attendance entry must have a valid student ObjectId'),

    ],

    // Validation for updating an existing session
    updateSession: [
        // Validate session ID: it must be a valid ObjectId
        param('id')
            .isMongoId()
            .withMessage('Invalid session ID'),

        // Validate startTime: it must be in HH:MM format if provided
        body('startTime')
            .optional()
            .matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
            .withMessage('startTime must be a valid time in HH:MM format'),

        // Validate endTime: it must be in HH:MM format if provided
        body('endTime')
            .optional()
            .matches(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
            .withMessage('endTime must be a valid time in HH:MM format'),

        // Validate attendance: it must be an array of objects containing valid student ObjectIds if provided
        body('attendance')
            .optional()
            .isArray()
            .withMessage('attendance must be an array of student objects')
            .custom((attendance) => attendance.every(att => mongoose.Types.ObjectId.isValid(att.student)))
            .withMessage('Each attendance entry must have a valid student ObjectId'),
    ],

    // Validation for marking attendance for a session
    markAttendance: [
        // Validate sessionId: it must be a valid ObjectId
        body('sessionId')
            .notEmpty()
            .withMessage('sessionId is required')
            .isMongoId()
            .withMessage('Invalid sessionId'),

        // Validate studentId: it must be a valid ObjectId
        body('studentId')
            .notEmpty()
            .withMessage('studentId is required')
            .isMongoId()
            .withMessage('Invalid studentId'),

        // Validate isPresent: it must be a boolean value
        body('isPresent')
            .isBoolean()
            .withMessage('isPresent must be a boolean value'),
    ]
};

// Middleware to check if there are any validation errors for session routes
const validateSession = (req, res, next) => {
    // Get the validation results from express-validator
    const errors = validationResult(req);

    // If there are validation errors, return a 400 response with the error details
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If no errors, proceed to the next middleware or route handler
    next();
};

// Exporting the validation rules
module.exports = { sessionValidationRules, validateSession };