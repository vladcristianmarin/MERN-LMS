import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		task: {
			type: String,
			required: true,
		},
		done: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
