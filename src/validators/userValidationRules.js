const { body, param, validationResult } = require('express-validator');

const userValidationRules = () => {
  return {
    // **createUser**: Validate username, email, password, and role
    createUser: [
      body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .isAlphanumeric()
        .withMessage('Username must only contain letters and numbers'),

      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/)
        .withMessage('Password must contain at least one letter'),

      body('role')
        .isIn(['student', 'teacher', 'admin'])
        .withMessage('Role must be one of the following: student, teacher, admin')
    ],

    // **getUserById**: Validate the user ID in the URL params
    getUserById: [
      param('id')
        .isMongoId()
        .withMessage('Invalid user ID format')
    ],

    // **updateUser**: Validate username, email, password, and role
    updateUser: [
      body('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .isAlphanumeric()
        .withMessage('Username must only contain letters and numbers'),

      body('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

      body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/)
        .withMessage('Password must contain at least one letter'),

      body('role')
        .optional()
        .isIn(['student', 'teacher', 'admin'])
        .withMessage('Role must be one of the following: student, teacher, admin')
    ],

    // **deleteUser**: Validate the user ID in the URL params
    deleteUser: [
      param('id')
        .isMongoId()
        .withMessage('Invalid user ID format')
    ],

    // **getUsersByRole**: Validate the role in the URL params
    getUsersByRole: [
      param('role')
        .isIn(['student', 'teacher', 'admin'])
        .withMessage('Role must be one of the following: student, teacher, admin')
    ],

    // **login**: Validate email and password in the body
    login: [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),

      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
    ],
  };
};

// Middleware to check if there are any validation errors
const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { userValidationRules, validateUser };