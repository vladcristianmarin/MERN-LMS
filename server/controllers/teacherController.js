import asyncHandler from 'express-async-handler';
import Teacher from '../models/teacherModel.js';

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

export { getTeachers, getTeacherCourses };
