import asyncHandler from 'express-async-handler';
import Group from '../models/groupModel.js';
import Student from '../models/studentModel.js';

//* @description    Creates new group
//* @route          POST /api/groups
//* @access         Protected / Admin

const createGroup = asyncHandler(async (req, res) => {
	const { code, school, yearOfStudy, students } = req.body;

	const findStudentIds = async () => {
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

	const studentIds = await findStudentIds();

	const uniqueStudentIds = Object.values(
		studentIds.reduce((acc, cur) => Object.assign(acc, { [cur.toString()]: cur }), {})
	);

	const groupExists = await Group.findOne({ code });

	if (groupExists) {
		res.status(400);
		throw new Error('Group already exists!');
	}

	const createdGroup = await Group.create({ code, school, yearOfStudy, students: uniqueStudentIds });

	const assignGroupToStudent = async () => {
		for (const stud of createdGroup.students) {
			const updatedStudent = await Student.findOne({ _id: stud });
			updatedStudent.group = createdGroup._id;
			await updatedStudent.save();
		}
	};

	await assignGroupToStudent();

	if (createdGroup) {
		return res.status(201).send(createdGroup);
	}

	res.status(400);
	throw new Error('Invalid group data');
});

//* @description    Get all groups
//* @route          GET /api/groups
//* @access         Protected / Admin

const getGroups = asyncHandler(async (_req, res) => {
	const groups = await Group.find({}).populate('students');
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

export { createGroup, getGroups, deleteGroup };
