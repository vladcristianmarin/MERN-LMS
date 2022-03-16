import mongoose from 'mongoose';
import User from './userModel.js';

const gradeSchema = mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Course',
		},
		score: {
			type: Number,
			min: 1,
			max: 10,
			required: true,
		},
	},
	{ timestamps: true }
);

gradeSchema.pre('save', function (next) {
	this.score = Math.round(this.score);
	next();
});

const studentSchema = mongoose.Schema(
	{
		grades: [gradeSchema],
		group: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
		},
	},
	{ discriminatorKey: 'role', timestamps: true }
);

User.discriminator('Student', studentSchema);

export default mongoose.model('Student');
