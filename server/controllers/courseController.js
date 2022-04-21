import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';
import Teacher from '../models/teacherModel.js';

//* @description    Creates new course
//* @route          POST /api/courses
//* @access         Protected / Admin

const createCourse = asyncHandler(async (req, res) => {
	const { name, acronym, teacher, description, weekday, hour } = req.body;
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
		weekday,
		hour,
	});

	foundTeacher.courses.push(createdCourse._id);
	await foundTeacher.save();

	if (!createdCourse) {
		res.status(400);
		throw new Error('Invalid course data!');
	}

	const courseWithTeacher = await Course.findOne({ _id: createdCourse._id }).populate('teacher');
	res.status(201).send(courseWithTeacher);
});

//* @description    Gets all courses
//* @route          GET /api/courses
//* @access         Protected / Admin

const getCourses = asyncHandler(async (_req, res) => {
	const courses = await Course.find({}).populate('teacher');
	res.send(courses);
});

//* @description    Removes a course and removes course from teacher
//* @route          DELETE /api/courses/:id
//* @access         Protected / Admin

const deleteCourse = asyncHandler(async (req, res) => {
	const deletedCourse = await Course.findOne({ _id: req.params.id });
	if (!deletedCourse) {
		res.status(404);
		throw new Error('Course not found!');
	}
	const teacher = await Teacher.findOne({ _id: deletedCourse.teacher }).populate('courses');
	teacher.courses = teacher.courses.filter((course) => !course._id.equals(deletedCourse._id));

	await teacher.save();
	await deletedCourse.remove();

	res.send(deletedCourse);
});

//* @description    Updates a course
//* @route          PATCH /api/courses/:id
//* @access         Private / Admin

const updateCourse = asyncHandler(async (req, res) => {
	const updates = Object.keys(req.body);
	const allowUpdates = ['name', 'acronym', 'teacher', 'weekday', 'hour', 'description'];
	const isValidOperation = updates.every((update) => allowUpdates.includes(update));

	if (!isValidOperation) {
		res.status(400);
		throw new Error('Invalid updates!');
	}

	const course = await Course.findOne({
		_id: req.params.id,
	}).populate('teacher');

	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

	if (req.body.teacher) {
		const oldTeacher = await Teacher.findOne({ _id: course.teacher._id }).populate('courses');
		const newTeacher = await Teacher.findOne({ _id: req.body.teacher._id }).populate('courses');

		if (!oldTeacher || !newTeacher) {
			res.status(404);
			throw new Error('Old/New Teacher not found!');
		}

		oldTeacher.courses = oldTeacher.courses.filter((c) => !c._id.equals(course._id));
		newTeacher.courses.push(course);

		await oldTeacher.save();
		await newTeacher.save();
	}

	updates.forEach((update) => (course[update] = req.body[update]));

	await course.save();

	res.status(201).send(course);
});

export { createCourse, getCourses, deleteCourse, updateCourse };
