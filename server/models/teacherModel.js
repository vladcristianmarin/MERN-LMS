import mongoose from 'mongoose';
import User from './userModel.js';

const teacherSchema = mongoose.Schema(
	{
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Course',
			},
		],
		groups: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Group',
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

User.discriminator('Teacher', teacherSchema);

export default mongoose.model('Teacher');
