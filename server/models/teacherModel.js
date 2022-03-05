import mongoose from 'mongoose';
import User from './userModel.js';

const teacherSchema = mongoose.Schema(
	{
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Course',
			},
		],
		classes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'Class',
			},
		],
		title: {
			type: String,
			trim: true,
			required: true,
		},
		school: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ discriminatorKey: 'role', timestamps: true }
);

const Teacher = User.discriminator('Teacher', teacherSchema);

export default Teacher;
