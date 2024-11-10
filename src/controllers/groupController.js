const Group = require('../models/group');   // Adjust path as needed
const User = require('../models/user');     // Required to verify student existence
const Course = require('../models/course'); // Required to verify course existence

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, students, courses } = req.body;

    // Verify that 'students' is an array of ObjectIds, if provided
    if (students && (!Array.isArray(students) || !students.every(student => mongoose.Types.ObjectId.isValid(student)))) {
      return res.status(400).json({ message: "'students' must be an array of valid ObjectId references" });
    }

    // Verify that 'courses' is an array of ObjectIds, if provided
    if (courses && (!Array.isArray(courses) || !courses.every(course => mongoose.Types.ObjectId.isValid(course)))) {
      return res.status(400).json({ message: "'courses' must be an array of valid ObjectId references" });
    }

    // Verify that all students exist and have the 'student' role
    if (students && students.length > 0) {
      const existingStudents = await User.find({ _id: { $in: students }, role: 'student' });
      if (existingStudents.length !== students.length) {
        return res.status(400).json({ message: 'One or more students not found or not valid students' });
      }
    }

    // Verify that all courses exist if provided
    if (courses && courses.length > 0) {
      const existingCourses = await Course.find({ _id: { $in: courses } });
      if (existingCourses.length !== courses.length) {
        return res.status(400).json({ message: 'One or more courses not found' });
      }
    }

    // Create and save the new group
    const newGroup = new Group({
      name,
      students,
      courses
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('students', 'username email')   // Populate student details
      .populate('courses', 'name');             // Populate course details

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('students', 'username email')
      .populate('courses', 'name');

    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a group by ID
exports.updateGroup = async (req, res) => {
  try {
    const { name, students, courses } = req.body;
    const updates = { name };

    // Validate and update students if provided
    if (students) {
      const existingStudents = await User.find({ _id: { $in: students }, role: 'student' });
      if (existingStudents.length !== students.length) {
        return res.status(400).json({ message: 'One or more students not found or not valid students' });
      }
      updates.students = students;
    }

    // Validate and update courses if provided
    if (courses) {
      const existingCourses = await Course.find({ _id: { $in: courses } });
      if (existingCourses.length !== courses.length) {
        return res.status(400).json({ message: 'One or more courses not found' });
      }
      updates.courses = courses;
    }

    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('students', 'username email')
      .populate('courses', 'name');

    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a group by ID
exports.deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) return res.status(404).json({ message: 'Group not found' });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a student to a group
exports.addStudentToGroup = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;

    // Verify the student exists and has the 'student' role
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found or not a valid student role' });

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { students: studentId } }, // Prevents duplicate students
      { new: true }
    ).populate('students', 'username email');

    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a course to a group
exports.addCourseToGroup = async (req, res) => {
  try {
    const { groupId, courseId } = req.body;

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { courses: courseId } }, // Prevents duplicate courses
      { new: true }
    ).populate('courses', 'name');

    if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};