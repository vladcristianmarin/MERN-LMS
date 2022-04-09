import mongoose from 'mongoose';
import Student from './studentModel.js';

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
				unique: true,
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

groupSchema.post('save', async function (error, _doc, next) {
	if (error.name === 'MongoServerError' && error.code === 11000) {
		const duplicateStudent = await Student.findOne({ _id: error.keyValue.students });
		next(new Error(`Student ${duplicateStudent.name}(${duplicateStudent.email}) already in another group!`));
	}
	next();
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
