import mongoose from 'mongoose';

const resourceSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		originalname: {
			type: String,
			required: true,
		},
		file: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

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
	weekday: {
		type: String,
		required: true,
	},
	hour: {
		type: Date,
		required: true,
	},
	inCall: {
		type: Boolean,
		default: false,
	},
	// students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
	chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
	resources: [resourceSchema],
});

const Course = mongoose.model('Course', courseSchema);
const Resource = mongoose.model('Resource', resourceSchema);

export default Course;
export { Resource };
