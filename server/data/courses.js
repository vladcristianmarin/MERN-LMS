const createCourses = (teachers) => [
	{
		name: 'CTS',
		teacher: teachers[0]._id,
		description: 'How to write clean and sustainable code',
	},
	{
		name: 'BTI',
		teacher: teachers[1]._id,
		description: 'The basics of computer programming',
	},
];

export default createCourses;
