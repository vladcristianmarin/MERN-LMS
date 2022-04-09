import asyncHandler from 'express-async-handler';
import Group from '../models/groupModel.js';
import Student from '../models/studentModel.js';

//* @description    Gets all students
//* @route          GET /api/students
//* @access         Protected / Admin

const getStudents = asyncHandler(async (req, res) => {
	const students = await Student.find({}).populate('grades group');
	res.send(students);
});

const changeStudentGroup = asyncHandler(async (req, res) => {
	const studentId = req.params.id;
	const newGroupCode = req.body.newGroup;

	const student = await Student.findOne({ _id: studentId }).populate('group');
	if (!student) {
		res.status(404);
		throw new Error('Student not found!');
	}
	if (!student.group) {
		res.status(404);
		throw new Error('Student is not in a group yet!');
	}
	const newGroup = await Group.findOne({ code: newGroupCode }).populate('students');
	if (!newGroup) {
		res.status(404);
		throw new Error('Group not found!');
	}

	if (student.group.code === newGroupCode) {
		res.status(400);
		throw new Error('Student already in this group!');
	}

	const oldGroup = await Group.findOne({ _id: student.group._id });
	oldGroup.students = oldGroup.students.filter((id) => !student._id.equals(id));
	await oldGroup.save();

	newGroup.students.push(student._id);
	await newGroup.save();

	student.group = newGroup._id;
	await student.save();

	res.status(201).send({ student, oldGroup: oldGroup.code, newGroup: newGroup.code });
});

export { getStudents, changeStudentGroup };
