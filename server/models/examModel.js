import mongoose from 'mongoose';

const examSchema = mongoose.Schema(
	{
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Teacher',
			required: true,
		},
		title: {
			type: String,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			required: true,
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		questions: [
			{
				question: {
					type: String,
					required: true,
				},
				answers: [
					{
						answer: {
							type: String,
							required: true,
						},
						correct: {
							type: Boolean,
							required: true,
						},
					},
				],
			},
		],
	},
	{ timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
