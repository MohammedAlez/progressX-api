const Course = require('../models/course'); // Adjust path as needed
const User = require('../models/user');     // Required to check for teacher existence
const File = require('../models/file');     // Required to check for files existence
const Group = require('../models/group');   // Required to check for groups existence
const Session = require('../models/session');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, teacher, files, groups } = req.body;

    // Verify that 'files' is an array of ObjectIds, if provided
    if (files && (!Array.isArray(files) || !files.every(file => mongoose.Types.ObjectId.isValid(file)))) {
      return res.status(400).json({ message: "'files' must be an array of valid ObjectId references" });
    }

    // Verify that 'groups' is an array of ObjectIds, if provided
    if (groups && (!Array.isArray(groups) || !groups.every(group => mongoose.Types.ObjectId.isValid(group)))) {
      return res.status(400).json({ message: "'groups' must be an array of valid ObjectId references" });
    }

    // Verify that the teacher exists and has the 'teacher' role
    const teacherUser = await User.findOne({ _id: teacher, role: 'teacher' });
    if (!teacherUser) {
      return res.status(400).json({ message: 'Teacher not found or not a valid teacher role' });
    }

    // Verify that all files exist if provided
    if (files && files.length > 0) {
      const existingFiles = await File.find({ _id: { $in: files } });
      if (existingFiles.length !== files.length) {
        return res.status(400).json({ message: 'One or more files not found' });
      }
    }

    // Verify that all groups exist if provided
    if (groups && groups.length > 0) {
      const existingGroups = await Group.find({ _id: { $in: groups } });
      if (existingGroups.length !== groups.length) {
        return res.status(400).json({ message: 'One or more groups not found' });
      }
    }

    // Create and save the new course
    const newCourse = new Course({
      name,
      teacher,
      files,
      groups
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateCourseProgress = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');

  // Get total duration of all sessions for this course
  const sessions = await Session.find({ course: courseId });
  const totalSessionDuration = sessions.reduce((acc, session) => acc + session.duration, 0);

  // Calculate progress as a percentage
  const progress = (totalSessionDuration / course.totalDuration) * 100;
  return progress;
};

// Get course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await calculateCourseProgress(courseId);
    res.status(200).json({ courseId, progress: `${progress.toFixed(2)}%` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'username email')  // Populating teacher details
      .populate('files', 'filename filePath') // Populating file details
      .populate('groups', 'name');            // Populating group details

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'username email')
      .populate('files', 'filename filePath')
      .populate('groups', 'name');

    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
  try {
    const { name, teacher, files, groups } = req.body;
    const updates = { name };

    // Validate and update teacher if provided
    if (teacher) {
      const teacherUser = await User.findOne({ _id: teacher, role: 'teacher' });
      if (!teacherUser) {
        return res.status(400).json({ message: 'Teacher not found or not a valid teacher role' });
      }
      updates.teacher = teacher;
    }

    // Validate and update files if provided
    if (files) {
      const existingFiles = await File.find({ _id: { $in: files } });
      if (existingFiles.length !== files.length) {
        return res.status(400).json({ message: 'One or more files not found' });
      }
      updates.files = files;
    }

    // Validate and update groups if provided
    if (groups) {
      const existingGroups = await Group.find({ _id: { $in: groups } });
      if (existingGroups.length !== groups.length) {
        return res.status(400).json({ message: 'One or more groups not found' });
      }
      updates.groups = groups;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('teacher', 'username email')
      .populate('files', 'filename filePath')
      .populate('groups', 'name');

    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a file to a course
exports.addFileToCourse = async (req, res) => {
  try {
    const { courseId, fileId } = req.body;

    // Verify the file exists
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Add the file to the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { files: fileId } }, // Prevents duplicate file entries
      { new: true }
    ).populate('files', 'filename filePath');

    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};