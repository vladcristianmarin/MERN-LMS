import asyncHandler from 'express-async-handler';
import Group from '../models/groupModel.js';
import Student from '../models/studentModel.js';
import Course from '../models/courseModel.js';
import Chat from '../models/chatModel.js';

//* @description    Creates new group
//* @route          POST /api/groups
//* @access         Protected / Admin

const createGroup = asyncHandler(async (req, res) => {
	const { code, school, yearOfStudy, students: studentsEmails } = req.body;

	const students = await Student.find({ email: { $in: studentsEmails } });

	const createdGroup = await Group.create({ code, school, yearOfStudy, students });

	await Student.updateMany({ email: { $in: studentsEmails } }, { group: createdGroup });

	if (!createdGroup) {
		res.status(400);
		throw new Error('Invalid group data');
	}

	await Group.populate(createdGroup, 'students');
	res.status(201).send(createdGroup);
});

//* @description    Adds new students in existing group
//* @route          POST /api/groups/:id
//* @access         Protected / Admin

const addStudents = asyncHandler(async (req, res) => {
	const { students: studentsEmails } = req.body;
	const { id: groupId } = req.params;

	if (!studentsEmails || studentsEmails.length === 0) {
		res.status(401);
		throw new Error('Students array was empty!');
	}
	const group = await Group.findOne({ _id: groupId }).populate('students');
	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	const students = await Student.find({ email: { $in: studentsEmails } });
	students.forEach((stud) => {
		if (group.students.toString().indexOf(stud._id) >= 0) {
			res.status(401);
			throw new Error(`Student ${stud.name}(${stud.email}) already in this group!`);
		}
	});

	let updatedGroup = null;
	try {
		updatedGroup = await Group.findOneAndUpdate(
			{ _id: group._id },
			{ $addToSet: { students: { $each: [...students] } } },
			{ new: true }
		).populate('students');
	} catch (error) {
		res.status(401);
		const duplicateStudent = await Student.findOne({ _id: error.keyValue.students });
		throw new Error(`Student ${duplicateStudent.name}(${duplicateStudent.email}) already in another group!`);
	}

	await Student.updateMany({ email: { $in: studentsEmails } }, { group: updatedGroup });

	res.status(201).send(updatedGroup);
});

//* @description    Removes student from a group
//* @route          DELETE /api/groups//:groupId/students/:studentId
//* @access         Private / Admin

const removeStudent = asyncHandler(async (req, res) => {
	const { groupId, studentId } = req.params;

	const student = await Student.findByIdAndUpdate(studentId, { $unset: { group: '' } });
	const group = await Group.findByIdAndUpdate(groupId, { $pull: { students: student._id } });

	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	if (!student) {
		res.status(404);
		throw new Error('Student not found!');
	}

	res.send(student);
});

//* @description    Get all groups
//* @route          GET /api/groups
//* @access         Protected / Admin

const getGroups = asyncHandler(async (_req, res) => {
	const groups = await Group.find({}).populate('students courses');
	await Group.populate(groups, { path: 'courses.teacher', select: 'name email' });
	res.send(groups);
});

//* @description    Removes a group and deletes group filed from all students in that group
//* @route          DELETE /api/groups/:id
//* @access         Protected / Admin

const deleteGroup = asyncHandler(async (req, res) => {
	const deletedGroup = await Group.findOneAndDelete({ _id: req.params.id });
	if (!deletedGroup) {
		res.status(404);
		throw new Error('Group not found!');
	}
	await Student.updateMany({ _id: { $in: deletedGroup.students } }, { $unset: { group: '' } });
	res.send(deletedGroup);
});

//* @description    Assign a course to a group
//* @route          POST /api/groups/:id/courses
//* @access         Protected / Admin

const addCourse = asyncHandler(async (req, res) => {
	const group = await Group.findOne({ _id: req.params.id });
	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	const course = await Course.findOne({ _id: req.body.courseId }).populate('teacher', 'name email');
	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

	await Chat.findOneAndUpdate({ course: course._id }, { $addToSet: { users: { $each: [...group.students] } } });

	group.courses.forEach((crs) => {
		if (course._id.equals(crs)) {
			res.status(401);
			throw new Error(`Group already enrolled in this course!`);
		}
	});

	const updatedGroup = await Group.findOneAndUpdate(
		{ _id: group._id },
		{ $addToSet: { courses: course._id } },
		{ new: true }
	).populate('courses');

	res.status(201).send({ updatedGroup, course });
});

//* @description    Removes course from a group
//* @route          DELETE /api/groups/:groupId/courses/:courseId
//* @access         Private / Admin

const removeCourse = asyncHandler(async (req, res) => {
	const { groupId, courseId } = req.params;

	const group = await Group.findByIdAndUpdate(groupId, { $pull: { courses: courseId } });
	const course = await Course.findOne({ _id: courseId });

	const studentsIds = group.students.map((stud) => stud._id);
	await Chat.findOneAndUpdate({ course: course._id }, { $pull: { users: { $in: [...studentsIds] } } }, { multi: true });

	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

	res.send({ updatedGroup: group, course });
});

//* @description    Updates a group
//* @route          PATCH /api/groups/:id
//* @access         Private / Admin

const updateGroup = asyncHandler(async (req, res) => {
	const updates = Object.keys(req.body);
	const allowUpdates = ['code', 'school', 'yearOfStudy'];
	const isValidOperation = updates.every((update) => allowUpdates.includes(update));

	if (!isValidOperation) {
		res.status(400);
		throw new Error('Invalid updates!');
	}

	const group = await Group.findOne({
		_id: req.params.id,
	});

	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}

	updates.forEach((update) => {
		if (update === 'yearOfStudy') {
			const year = parseInt(req.body.yearOfStudy);
			group.yearOfStudy = year;
			return;
		}
		group[update] = req.body[update];
	});

	await group.save();

	res.status(201).send(group);
});

//* @description    Get group students
//* @route          GET /api/groups/:id/students
//* @access         Private

const getGroupStudents = asyncHandler(async (req, res) => {
	const group = await Group.findOne({
		_id: req.params.id,
	}).populate('students');
	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	res.send(group.students);
});

export {
	createGroup,
	addStudents,
	removeStudent,
	getGroups,
	deleteGroup,
	updateGroup,
	addCourse as addCourseToGroup,
	removeCourse,
	getGroupStudents,
};
