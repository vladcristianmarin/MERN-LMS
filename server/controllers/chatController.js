import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';

//* @description    Fetch all chats for a user
//* @route          GET /api/chats
//* @access         Protected
const fetchChats = asyncHandler(async (req, res) => {
	let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
		.populate('users')
		.populate('admin')
		.populate('latestMessage')
		.sort({ updatedAt: -1 });
	chats = await User.populate(chats, { path: 'latestMessage.sender', select: 'name avatar email' });
	res.send(chats);
});

//* @description    Create new group chat
//* @route          POST /api/chat/group
//* @access         Protected / Admin
const createGroupChat = asyncHandler(async (req, res) => {
	if (!req.body.users || !req.body.name) {
		res.status(400);
		throw new Error('Invalid chat data');
	}

	let users = req.body.users;

	if (users.length < 2) {
		res.status(400);
		throw new Error('2 or more users are required for a group chat!');
	}

	const groupChat = await Chat.create({
		chatName: req.body.name,
		users,
		admin: req.body.admin || req.user,
	});

	const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
		.populate('users', '-courses -groups')
		.populate('admin');
	res.status(201).send(fullGroupChat);
});

//* @description    Remove user from group chat
//* @route          DELETE /api/chat/group
//* @access         Protected / Admin
const removeFromGroupChat = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
		.populate('users', '-courses -groups')
		.populate('admin');
	if (!removed) {
		res.status(404);
		throw new Error('Chat not found!');
	}
	res.send(removed);
});

//* @description    Add user to group chat
//* @route          PUT /api/chat/group/
//* @access         Protected / Admin
const addToGroupChat = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;
	const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
		.populate('users', '-courses -groups')
		.populate('admin');
	if (!added) {
		res.status(404);
		throw new Error('Chat not found!');
	}
	res.status(201).send(added);
});

//* @description    Update chat name
//* @route          PATCH /api/chat/group/
//* @access         Protected / Admin
const renameGroupChat = asyncHandler(async (req, res) => {
	const { newName, chatId } = req.body;
	const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: newName }, { new: true })
		.populate('users', '-courses -groups')
		.populate('admin');

	if (!updatedChat) {
		res.status(404);
		throw new Error('Chat Not Found');
	}

	res.send(updatedChat);
});

export { fetchChats, createGroupChat, removeFromGroupChat, addToGroupChat, renameGroupChat };
