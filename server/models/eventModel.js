import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		title: {
			type: String,
			required: true,
		},
		allDay: {
			type: Boolean,
		},
		date: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
