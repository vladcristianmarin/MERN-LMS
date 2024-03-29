import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import Course from '../models/courseModel.js';
import Group from '../models/groupModel.js';
import { Resource } from '../models/courseModel.js';
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

	let createdCourse = await Course.create({
		name,
		acronym,
		teacher: foundTeacher._id,
		description,
		weekday,
		hour,
	});

	if (!createdCourse) {
		res.status(400);
		throw new Error('Invalid course data!');
	}

	await Teacher.updateOne({ _id: foundTeacher._id }, { $push: { courses: createdCourse._id } });
	const courseChat = await Chat.create({
		chatName: `${acronym}'s Chat`,
		users: [foundTeacher._id],
		admin: foundTeacher._id,
		course: createdCourse._id,
	});

	createdCourse = await Course.populate(createdCourse, 'teacher');
	createdCourse.chat = courseChat._id;
	await createdCourse.save();
	res.status(201).send(createdCourse);
});

//* @description    Gets  courses by id
//* @route          GET /api/courses/:id
//* @access         Protected

const getCourse = asyncHandler(async (req, res) => {
	const courseId = req.params.id;
	const course = await Course.findById(courseId).populate('teacher resources');
	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}
	res.send(course);
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
	const deletedCourse = await Course.findByIdAndDelete(req.params.id);
	if (!deletedCourse) {
		res.status(404);
		throw new Error('Course not found!');
	}
	await Teacher.findByIdAndUpdate(deleteCourse.teacher, { $pull: { courses: deleteCourse._id } });
	await Chat.findOneAndDelete({ course: deletedCourse._id });

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
	});

	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

	if (req.body.teacher) {
		await Teacher.findByIdAndUpdate(course.teacher, { $pull: { courses: course._id } });
		await Teacher.findByIdAndUpdate(req.body.teacher._id, { $push: { courses: course._id } });
	}

	if (req.body.acronym) {
		await Chat.findOneAndUpdate({ course: course._id }, { chatName: `${req.body.acronym}'s Chat` });
	}

	updates.forEach((update) => (course[update] = req.body[update]));

	await course.save();

	await Course.populate(course, { path: 'teacher', select: 'name' });

	res.status(201).send(course);
});

//* @description    Upload course resource
//* @route          POST /api/courses/:id/resources
//* @access         Protected

const uploadResource = asyncHandler(async (req, res) => {
	const resource = await Resource.create({
		title: req.body.title,
		description: req.body.description,
		originalname: req.file.originalname,
		file: req.file.path,
	});

	await Course.updateOne({ _id: req.params.id }, { $push: { resources: resource } });

	res.status(201).send(resource);
});

//* @description    List all course resources
//* @route          GET /api/courses/:id/resources
//* @access         Protected

const getResources = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.id).populate('teacher resources');

	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

	switch (req.user.role) {
		case 'Teacher': {
			if (!course.teacher._id.equals(req.user._id)) {
				throw new Error('Access denied! This is not your course!');
			}
			break;
		}
		case 'Student': {
			const group = await Group.findById(req.user.group);
			if (!group.courses.includes(course._id)) {
				throw new Error('Access denied! You are not enrolled in this course!');
			}
			break;
		}
	}

	res.send(course.resources);
});

export { createCourse, getCourses, getCourse, deleteCourse, updateCourse, uploadResource, getResources };
