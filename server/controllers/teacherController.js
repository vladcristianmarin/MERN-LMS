import asyncHandler from 'express-async-handler';
import Teacher from '../models/teacherModel.js';
import Course from '../models/courseModel.js';
import Group from '../models/groupModel.js';

//* @description    Gets all teachers
//* @route          GET /api/teachers
//* @access         Protected / Admin

const getTeachers = asyncHandler(async (_req, res) => {
	const teachers = await Teacher.find({});
	res.send(teachers);
});

//* @description    Gets teacher courses
//* @route          GET /api/teachers/:id/courses
//* @access         Protected / Admin

const getTeacherCourses = asyncHandler(async (req, res) => {
	const teacher = await Teacher.findOne({ _id: req.params.id }).populate('courses');
	if (!teacher) {
		res.status(400);
		throw new Error('Teacher not found!');
	}
	res.send(teacher.courses);
});

//* @description    Populate my courses as teacher
//* @route          GET /api/teachers/mycourses
//* @access         Protected

const getMyCourses = asyncHandler(async (req, res) => {
	const courses = await Course.find({ teacher: req.user._id }).populate({
		path: 'teacher',
		select: 'name avatar email',
	});
	let groups = await Group.find({ courses: { $in: courses } })
		.select('students code courses')
		.populate({ path: 'students', select: 'name email avatar', options: { sort: { avatar: -1 } } });

	res.send({ courses, groups });
});

export { getTeachers, getTeacherCourses, getMyCourses };
