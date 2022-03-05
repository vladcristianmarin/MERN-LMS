import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) throw new Error('Email is invalid!');
			},
		},
		phoneNumber: {
			trim: true,
			type: String,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		country: {
			type: String,
			trim: true,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{ discriminatorKey: 'role', timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
		expiresIn: '30 days',
	});
	user.tokens.push({ token });
	await user.save();
	return token;
};

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;

	return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error('Unable to log in!');
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error('Unable to login!');
	return user;
};

userSchema.pre('save', async function (next) {
	const user = this;
	user.isModified('password') &&
		(user.password = await bcrypt.hash(user.password, 8));
	next();
});

const User = mongoose.model('User', userSchema);

export default User;
