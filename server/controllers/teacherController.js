import asyncHandler from 'express-async-handler';
import Teacher from '../models/teacherModel.js';

const getTeachers = asyncHandler(async (req, res) => {
	const teachers = await Teacher.find({});
	res.send(teachers);
});

export { getTeachers };
