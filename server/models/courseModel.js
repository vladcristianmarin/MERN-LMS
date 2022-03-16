import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	file: {
		type: Buffer,
		required: true,
	},
});

const courseSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	acronym: {
		type: String,
		required: true,
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Teacher',
	},
	description: {
		type: String,
		required: true,
	},
	resources: [resourceSchema],
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
