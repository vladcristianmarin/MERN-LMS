import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';

const getStudents = asyncHandler(async (req, res) => {
	const students = await Student.find({});
	res.send(students);
});

export { getStudents };
