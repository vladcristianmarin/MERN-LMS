import bcrypt from 'bcryptjs';

const teachers = [
	{
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
		name: 'Margret',
		email: 'margret@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
		school: 'ASE Bucuresti',
		title: 'Prof. Dr.',
	},
];

const students = [
	{
		name: 'John',
		email: 'john@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
	},
	{
		name: 'Emma',
		email: 'emma@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
	},
	{
		name: 'Mihaela',
		email: 'mihaela@example.com',
		phoneNumber: '+40123456789',
		password: bcrypt.hashSync('123456'),
		country: 'Romania',
	},
];

export { teachers, students };
