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

	foundTeacher.courses.push(createdCourse._id);
	await foundTeacher.save();

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

const deleteCourse = asyncHandler(async (req, res) => {
	const deletedCourse = await Course.findOne({ _id: req.params.id });
	if (!deletedCourse) {
		res.status(404);
		throw new Error('Course not found!');
	}
	console.log(deletedCourse);
	const teacher = await Teacher.findOne({ _id: deletedCourse.teacher }).populate('courses');
	console.log(teacher);
	teacher.courses = teacher.courses.filter((course) => !course._id.equals(deletedCourse._id));

	await teacher.save();
	await deletedCourse.remove();

	res.send(deletedCourse);
});

export { createCourse, getCourses, deleteCourse };
