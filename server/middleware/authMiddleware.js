import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
	let token;
	console.log(req.headers.authorization);
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.replace('Bearer ', '');

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findOne({
				_id: decoded._id,
				'tokens.token': token,
			});
			req.user = user;
			req.token = token;
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error('Unauthorized, invalid token!');
		}
	} else {
		res.status(401);
		throw new Error('Unauthorized, no token!');
	}
});

const admin = asyncHandler((req, res, next) => {
	if (req.user && req.user.isAdmin) {
		return next();
	}
	res.status(401);
	throw new Error('Not authorized! Admins only!');
});

export { protect, admin };
