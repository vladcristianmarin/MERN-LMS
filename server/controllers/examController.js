import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import Exam from '../models/examModel.js';
import Group from '../models/groupModel.js';

export const createExam = asyncHandler(async (req, res) => {
	const { title, description, date, course, questions, timer } = req.body;
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
		timer,
		course: foundCourse._id,
		createdBy: req.user._id,
	});

	if (!createdExam) {
		res.status(400);
		throw new Error('Invalid exam data!');
	}

	res.status(201).send(createdExam);
});

export const getStudentExams = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.user.group).populate('courses');
	if (!group) {
		res.status(400);
		throw new Error('Only students in groups can have exams');
	}
	const courses = group.courses.map((c) => c._id);
	const exams = await Exam.find({ course: { $in: courses } });
	if (!exams) {
		res.status(400);
		throw new Error('Something went wrong!');
	}
	const examsToReturn = exams.map((e) => e.toObject());
	examsToReturn.forEach(async (e) => {
		e.canStart = new Date().getTime() >= e.date.getTime() >= new Date().getTime() + e.timer * 60000;
		e.questions.forEach((q) => q.answers.forEach((a) => delete a.correct));
	});
	res.send(examsToReturn);
});
