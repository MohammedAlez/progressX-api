const { body, param, validationResult } = require('express-validator');

const courseValidationRules = {
  // **createCourse**: Validate name, teacher, files, and groups
  createCourse: [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Course name must be at least 3 characters long')
      .notEmpty()
      .withMessage('Course name cannot be empty'),

    body('teacher')
      .isMongoId()
      .withMessage('Invalid teacher ID format')
      .notEmpty()
      .withMessage('Teacher ID cannot be empty'),

    body('files')
      .optional()
      .isArray()
      .withMessage('Files should be an array of file IDs')
      .custom((files) => files.every((file) => typeof file === 'string' && file.match(/^[0-9a-fA-F]{24}$/)))
      .withMessage('Each file ID must be a valid ObjectId'),

    body('groups')
      .optional()
      .isArray()
      .withMessage('Groups should be an array of group IDs')
      .custom((groups) => groups.every((group) => typeof group === 'string' && group.match(/^[0-9a-fA-F]{24}$/)))
      .withMessage('Each group ID must be a valid ObjectId')
  ],

  // **getCourseById**: Validate the course ID in the URL params
  getCourseById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid course ID format')
  ],
  getCourseProgress: [
    param('id')
      .isMongoId()
      .withMessage('Invalid course ID format')
  ],

  // **updateCourse**: Validate name, teacher, files, groups, and course ID
  updateCourse: [
    body('name')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Course name must be at least 3 characters long')
      .notEmpty()
      .withMessage('Course name cannot be empty'),

    body('teacher')
      .optional()
      .isMongoId()
      .withMessage('Invalid teacher ID format'),

    body('files')
      .optional()
      .isArray()
      .withMessage('Files should be an array of file IDs')
      .custom((files) => files.every((file) => typeof file === 'string' && file.match(/^[0-9a-fA-F]{24}$/)))
      .withMessage('Each file ID must be a valid ObjectId'),

    body('groups')
      .optional()
      .isArray()
      .withMessage('Groups should be an array of group IDs')
      .custom((groups) => groups.every((group) => typeof group === 'string' && group.match(/^[0-9a-fA-F]{24}$/)))
      .withMessage('Each group ID must be a valid ObjectId'),

    param('id')
      .isMongoId()
      .withMessage('Invalid course ID format')
  ],

  // **deleteCourse**: Validate the course ID in the URL params
  deleteCourse: [
    param('id')
      .isMongoId()
      .withMessage('Invalid course ID format')
  ]
};

// Middleware to check if there are any validation errors
const validateCourse = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { courseValidationRules, validateCourse };