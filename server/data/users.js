import bcrypt from 'bcryptjs';

const users = [
	{
		role: 'teacher',
		name: 'Adam',
		email: 'adam@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
		school: 'ASE Bucuresti',
		title: 'Prof. Dr.',
		isAdmin: true,
	},
	{
		role: 'teacher',
		name: 'Margret',
		email: 'margret@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
		school: 'ASE Bucuresti',
		title: 'Prof. Dr.',
	},
	{
		role: 'student',
		name: 'John',
		email: 'john@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
		yearsOfStudy: '2019-2022',
	},
	{
		role: 'student',
		name: 'Emma',
		email: 'emma@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
		yearsOfStudy: '2019-2022',
	},
];

export default users;
