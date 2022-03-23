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
	yearOfStudy: {
		type: Number,
		required: true,
	},
	students: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Student',
			},
		],
		validate: (v) => Array.isArray(v) && v.length > 0,
	},
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
		},
	],
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
