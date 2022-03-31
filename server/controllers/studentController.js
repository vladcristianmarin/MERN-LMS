import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';

//* @description    Gets all students
//* @route          GET /api/students
//* @access         Protected / Admin

const getStudents = asyncHandler(async (req, res) => {
	const students = await Student.find({}).populate('grades group');
	res.send(students);
});

export { getStudents };
