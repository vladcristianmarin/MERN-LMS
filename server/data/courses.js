const createCourses = (teachers) => [
	{
		name: 'Quality and testing of software',
		acronym: 'QTS',
		teacher: teachers[0]._id,
		description: 'How to write clean and sustainable code',
	},
	{
		name: 'Bases of information technology',
		acronym: 'BTI',
		teacher: teachers[1]._id,
		description: 'The basics of computer programming',
	},
];

export default createCourses;
