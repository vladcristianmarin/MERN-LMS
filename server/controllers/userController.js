import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';
import Teacher from '../models/teacherModel.js';

//* @description    Auth user && get token
//* @route          POST /api/users/login
//* @access         Public

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findByCredentials(email, password);
	if (user) {
		return res.send({ user, token: user.generateAuthToken() });
	}
	res.status(401);
	throw new Error('Invalid email or password!');
});

//* @description    Register new user
//* @route          POST /api/users
//* @access         Public

const registerUser = asyncHandler(async (req, res) => {
	const userExists = await User.findOne({ email: req.body.email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists!');
	}

	let user;

	switch (req.body.role) {
		case 'student': {
			delete req.body.role;
			user = new Student(req.body);
			if (!req.body.class) {
				user.class = process.env.BASE_CLASS_ID;
			}
			break;
		}
		case 'teacher': {
			delete req.body.role;
			user = new Teacher(req.body);
			break;
		}
		default: {
			res.status(400);
			throw new Error('Please select Student or Teacher');
		}
	}

	const createdUser = await user.save();
	if (createdUser) {
		const token = await user.generateAuthToken();
		return res.status(201).send({ user, token });
	}
	res.status(400);
	throw new Error('Invalid user data');
});

export { authUser, registerUser };
