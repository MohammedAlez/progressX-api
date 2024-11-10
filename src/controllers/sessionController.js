const Session = require('../models/session');   // Adjust path as needed
const Course = require('../models/course');     // Required to verify course existence
const Group = require('../models/group');       // Required to verify group existence
const User = require('../models/user');         // Required to verify student existence

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { courseId, groupId, date, startTime, endTime, attendance } = req.body;

    // Verify course and group exist
    const course = await Course.findById(courseId);
    const group = await Group.findById(groupId);

    if (!course || !group) {
      return res.status(404).json({ message: 'Course or Group not found' });
    }

    // Verify attendance list contains only valid students
    const studentIds = attendance.map((att) => att.student);
    const students = await User.find({ _id: { $in: studentIds }, role: 'student' });

    if (students.length !== attendance.length) {
      return res.status(400).json({ message: 'One or more students not found or not valid students' });
    }

    // Create and save the new session
    const newSession = new Session({
      course: courseId,
      group: groupId,
      date,
      startTime,
      endTime,
      attendance,
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sessions for a specific course and group
exports.getSessions = async (req, res) => {
  try {
    const { courseId, groupId } = req.params;

    const sessions = await Session.find({ course: courseId, group: groupId })
      .populate('course', 'name')
      .populate('group', 'name')
      .populate('attendance.student', 'username email'); // Populate student attendance details

    if (!sessions) return res.status(404).json({ message: 'No sessions found' });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('course', 'name')
      .populate('group', 'name')
      .populate('attendance.student', 'username email');

    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a session by ID
exports.updateSession = async (req, res) => {
  try {
    const { startTime, endTime, attendance } = req.body;

    // Ensure the attendance contains valid student references
    if (attendance) {
      const studentIds = attendance.map((att) => att.student);
      const students = await User.find({ _id: { $in: studentIds }, role: 'student' });

      if (students.length !== attendance.length) {
        return res.status(400).json({ message: 'One or more students not found or not valid students' });
      }
    }

    const updates = { startTime, endTime, attendance };

    // Recalculate sessionTime if startTime or endTime is updated
    if (startTime && endTime) {
      updates.sessionTime = (new Date(endTime) - new Date(startTime)) / (1000 * 60); // in minutes
    }

    const updatedSession = await Session.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('course', 'name')
      .populate('group', 'name')
      .populate('attendance.student', 'username email');

    if (!updatedSession) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a session by ID
exports.deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);

    if (!deletedSession) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance for a session
exports.markAttendance = async (req, res) => {
  try {
    const { sessionId, studentId, isPresent } = req.body;

    // Verify the session and student exist
    const session = await Session.findById(sessionId);
    const student = await User.findById(studentId);

    if (!session || student.role !== 'student') {
      return res.status(404).json({ message: 'Session or student not found or invalid' });
    }

    // Find the attendance record for the student
    const attendanceIndex = session.attendance.findIndex((att) => att.student.toString() === studentId);

    if (attendanceIndex === -1) {
      return res.status(404).json({ message: 'Attendance record not found for this student' });
    }

    // Update attendance status
    session.attendance[attendanceIndex].isPresent = isPresent;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};