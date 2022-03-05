import mongoose from 'mongoose';

const classSchema = mongoose.Schema({
	code: {
		type: String,
		trim: true,
		required: true,
	},
	school: {
		type: String,
		required: true,
		trim: true,
	},
	students: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
	],
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Course',
		},
	],
});

const Class = mongoose.model('Class', classSchema);

export default Class;
