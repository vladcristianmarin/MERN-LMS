import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';

const getStudents = asyncHandler(async (req, res) => {
	const students = await Student.find({}).populate('grades group');
	res.send(students);
});

export { getStudents };
