import asyncHandler from 'express-async-handler';
import Teacher from '../models/teacherModel.js';

const getTeachers = asyncHandler(async (req, res) => {
	const teachers = await Teacher.find({});
	res.send(teachers);
});

const getTeacherCourses = asyncHandler(async (req, res) => {
	const teacher = await Teacher.findOne({ _id: req.params.id }).populate('courses');
	if (!teacher) {
		res.status(400);
		throw new Error('Teacher not found!');
	}
	res.send(teacher.courses);
});

export { getTeachers, getTeacherCourses };
