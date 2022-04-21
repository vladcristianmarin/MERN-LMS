import asyncHandler from 'express-async-handler';
import Group from '../models/groupModel.js';
import Student from '../models/studentModel.js';
import Course from '../models/courseModel.js';

//* UTILS

//* used in createGroup and addStudents

const findStudentIds = async (students) => {
	return Promise.all(
		students.map(async (stud) => {
			const foundStud = await Student.findOne({ email: stud });
			if (foundStud) {
				return foundStud._id;
			}
			res.status(400);
			throw new Error(`${stud} does not exists!`);
		})
	);
};

const assignGroupToStudent = async (group) => {
	for (const stud of group.students) {
		const updatedStudent = await Student.findOne({ _id: stud });
		updatedStudent.group = group._id;
		await updatedStudent.save();
	}
};

const populateCoursesTeacher = async (group) => {
	for (const course of group.courses) {
		await course.populate('teacher');
	}
};

//* @description    Creates new group
//* @route          POST /api/groups
//* @access         Protected / Admin

const createGroup = asyncHandler(async (req, res) => {
	const { code, school, yearOfStudy, students } = req.body;

	const studentIds = await findStudentIds(students);

	const uniqueStudentIds = Object.values(
		studentIds.reduce((acc, cur) => Object.assign(acc, { [cur.toString()]: cur }), {})
	);

	const groupExists = await Group.findOne({ code });

	if (groupExists) {
		res.status(400);
		throw new Error('Group already exists!');
	}

	const createdGroup = await Group.create({ code, school, yearOfStudy, students: uniqueStudentIds });

	await assignGroupToStudent(createdGroup);

	if (createdGroup) {
		const groupWithStudents = await Group.findOne({ _id: createdGroup._id }).populate('students');
		return res.status(201).send(groupWithStudents);
	}

	res.status(400);
	throw new Error('Invalid group data');
});

//* @description    Adds new students in existing group
//* @route          POST /api/groups/:id
//* @access         Protected / Admin

const addStudents = asyncHandler(async (req, res) => {
	const { students } = req.body;
	const { id: groupId } = req.params;

	if (!students || students.length === 0) {
		res.status(401);
		throw new Error('Students array was empty!');
	}

	const studentIds = await findStudentIds(students);

	const uniqueStudentIds = Object.values(
		studentIds.reduce((acc, cur) => Object.assign(acc, { [cur.toString()]: cur }), {})
	);

	const group = await Group.findOne({ _id: groupId }).populate('students');

	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}

	group.students.forEach((stud) => {
		if (uniqueStudentIds.toString().indexOf(stud._id) >= 0) {
			res.status(401);
			throw new Error(`Student ${stud.name}(${stud.email}) already in this group!`);
		}
	});

	let updatedGroup = null;
	try {
		updatedGroup = await Group.findOneAndUpdate(
			{ _id: group._id },
			{ $addToSet: { students: { $each: [...uniqueStudentIds] } } },
			{ new: true }
		).populate('students');
	} catch (error) {
		res.status(401);
		const duplicateStudent = await Student.findOne({ _id: error.keyValue.students });
		throw new Error(`Student ${duplicateStudent.name}(${duplicateStudent.email}) already in another group!`);
	}

	await assignGroupToStudent(updatedGroup);

	res.status(201).send(updatedGroup);
});

//* @description    Removes student from a group
//* @route          DELETE /api/groups//:groupId/students/:studentId
//* @access         Private / Admin

const removeStudent = asyncHandler(async (req, res) => {
	const { groupId, studentId } = req.params;

	const group = await Group.findOne({ _id: groupId });
	const student = await Student.findOne({ _id: studentId });

	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	if (!student) {
		res.status(404);
		throw new Error('Student not found!');
	}

	student.group = undefined;
	group.students = group.students.filter((stud) => !stud._id.equals(student._id));

	await group.save();
	await student.save();

	res.send(student);
});

//* @description    Get all groups
//* @route          GET /api/groups
//* @access         Protected / Admin

const getGroups = asyncHandler(async (_req, res) => {
	const groups = await Group.find({}).populate('students').populate('courses');
	for (const group of groups) {
		await populateCoursesTeacher(group);
	}
	res.send(groups);
});

//* @description    Removes a group and deletes group filed from all students in that group
//* @route          DELETE /api/groups/:id
//* @access         Protected / Admin

const deleteGroup = asyncHandler(async (req, res) => {
	const deletedGroup = await Group.findOne({ _id: req.params.id }).populate('students');
	if (!deletedGroup) {
		res.status(404);
		throw new Error('Group not found!');
	}
	const removeStudentsFromGroup = async () => {
		for (const stud of deletedGroup.students) {
			const updatedStudent = await Student.findOne({ _id: stud });
			updatedStudent.group = undefined;
			await updatedStudent.save();
		}
	};
	removeStudentsFromGroup();
	await deletedGroup.remove();
	res.send(deletedGroup);
});

//* @description    Assign a course to a group
//* @route          POST /api/groups/:id/courses
//* @access         Protected / Admin

const addCourseToGroup = asyncHandler(async (req, res) => {
	const group = await Group.findOne({ _id: req.params.id });
	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	const course = await Course.findOne({ _id: req.body.courseId }).populate('teacher');
	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

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

	const group = await Group.findOne({ _id: groupId });
	const course = await Course.findOne({ _id: courseId });

	if (!group) {
		res.status(404);
		throw new Error('Group not found!');
	}
	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}

	group.courses = group.courses.filter((c) => !c._id.equals(course._id));

	await group.save();

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

export { createGroup, addStudents, removeStudent, getGroups, deleteGroup, updateGroup, addCourseToGroup, removeCourse };
