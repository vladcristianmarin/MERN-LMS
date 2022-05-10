import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';
import Teacher from '../models/teacherModel.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//* @description    Checks if token is expired
//* @route          GET /api/users/verifiy
//* @access         Public

const verifyToken = asyncHandler(async (req, res) => {
	try {
		jwt.verify(req.params.token, process.env.JWT_SECRET);
		res.send(false);
	} catch (_err) {
		res.send(true);
	}
});

//* @description    Auth user && get token
//* @route          POST /api/users/login
//* @access         Public

const authUser = asyncHandler(async (req, res) => {
	const { email, password, remember } = req.body;
	const user = await User.findByCredentials(email, password);
	if (user) {
		return res.send({ user, token: await user.generateAuthToken(remember) });
	}
	res.status(401);
	throw new Error('Invalid email or password!');
});

//* @description    Logout user
//* @route          POST /api/users/logout
//* @access         Private

const logoutUser = asyncHandler(async (req, res) => {
	req.user.tokens = req.user.tokens.filter((item) => item.token !== req.token);
	await req.user.save();
	res.send();
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

//* @description    Makes a teacher admin
//* @route          GET /api/users/:id/grantAdmin
//* @access         Protected / Admin

const makeAdmin = asyncHandler(async (req, res) => {
	const selectedUser = await User.findOne({ _id: req.params.id });

	if (!selectedUser) {
		res.status(404);
		throw new Error('User not found!');
	}
	if (selectedUser.role !== 'Teacher') {
		res.status(400);
		throw new Error('Students cannot be admins!');
	}
	if (selectedUser.isAdmin) {
		res.status(400);
		throw new Error('User already is an admin!');
	}

	selectedUser.isAdmin = true;
	await selectedUser.save();
	res.status(201).send();
});

//* @description    Uploade avatar picture
//* @route          POST /api/users/me/avatar
//* @access         Protected

const uploadAvatar = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true });

	if (!user) {
		res.status(404);
		throw new Error('User not found!');
	}
	res.send(user);
});

export { authUser, registerUser, logoutUser, verifyToken, makeAdmin, uploadAvatar };
