import mongoose from 'mongoose';

const groupSchema = mongoose.Schema({
	code: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	school: {
		type: String,
		required: true,
		trim: true,
	},
	students: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Student',
		},
	],
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
		},
	],
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
