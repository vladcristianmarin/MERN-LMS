import asyncHandler from 'express-async-handler';
import Group from '../models/groupModel.js';
import Student from '../models/studentModel.js';

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

	if (createdGroup) {
		return res.status(201).send(createdGroup);
	}

	res.status(400);
	throw new Error('Invalid group data');
});

const getGroups = asyncHandler(async (req, res) => {
	const groups = await Group.find({});
	res.send(groups);
});

export { createGroup, getGroups };
