import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import Exam from '../models/examModel.js';

//* @description    Creates new course
//* @route          POST /api/courses
//* @access         Protected / Admin

export const createExam = asyncHandler(async (req, res) => {
	const { title, description, date, course, questions } = req.body;
	const foundCourse = await Course.findOne({ name: course, teacher: req.user._id });

	if (req.user.role !== 'Teacher') {
		res.status(401);
		throw new Error('Only teachers can create exams!');
	}

	if (!foundCourse) {
		res.status(400);
		throw new Error('Invalid course!');
	}

	let createdExam = await Exam.create({
		title,
		description,
		date,
		questions,
		course: foundCourse._id,
		createdBy: req.user._id,
	});

	if (!createdExam) {
		res.status(400);
		throw new Error('Invalid exam data!');
	}

	res.status(201).send(createdExam);
});
