import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import Teacher from '../models/teacherModel.js';

const createCourse = asyncHandler(async (req, res) => {
	const { name, acronym, teacher, description } = req.body;
	const foundTeacher = await Teacher.findOne({ email: teacher });

	if (!foundTeacher) {
		res.status(400);
		throw new Error("Invalid teacher's email!");
	}

	const createdCourse = await Course.create({
		name,
		acronym,
		teacher: foundTeacher._id,
		description,
	});

	if (!createdCourse) {
		res.status(400);
		throw new Error('Invalid course data!');
	}

	res.status(201).send(createdCourse);
});

const getCourses = asyncHandler(async (req, res) => {
	const courses = await Course.find({});
	res.send(courses);
});

export { createCourse, getCourses };
