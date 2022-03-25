import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { students, teachers } from './data/users.js';
import User from './models/userModel.js';
import Student from './models/studentModel.js';
import Teacher from './models/teacherModel.js';
import Course from './models/courseModel.js';
import Group from './models/groupModel.js';
import connectDB from './config/database.js';
import group from './data/groups.js';
import createCourses from './data/courses.js';

dotenv.config();
connectDB();

const importData = async () => {
	try {
		await User.deleteMany({});
		await Student.deleteMany({});
		await Teacher.deleteMany({});
		await Course.deleteMany({});
		await Group.deleteMany({});

		const studentsFromDB = await Student.insertMany(students);

		const groupFromDb = await Group.create({ ...group, students: studentsFromDB.map((stud) => stud._id) });

		for (const stud of studentsFromDB) {
			stud.group = groupFromDb._id;
			await stud.save();
		}

		const teachersFromDB = await Teacher.insertMany(teachers);

		const courses = createCourses(teachersFromDB);

		await Course.insertMany(courses);

		console.log('Data Imported!'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await User.deleteMany({});
		await Student.deleteMany({});
		await Teacher.deleteMany({});
		await Course.deleteMany({});
		await Group.deleteMany({});

		console.log('Data Destroyed!'.red.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

if (process.argv[2] === '-d') {
	destroyData();
} else {
	importData();
}
