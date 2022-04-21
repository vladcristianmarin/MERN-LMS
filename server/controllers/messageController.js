import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';

//* @description    Get all chat messages
//* @route          GET /api/messages/:chatId
//* @access         Protected
const getMessages = asyncHandler(async (req, res) => {
	const messages = await Message.find({ chat: req.params.chat })
		.populate('sender', 'name avatar email')
		.populate('chat');
	res.send(messages);
});

//* @description    Creates a new message
//* @route          POST /api/messages
//* @access         Protected
const sendMessage = asyncHandler(async (req, res) => {
	const { content, chatId } = req.body;

	if (!content) {
		res.status(400);
		throw new Error('Empty messages cannot be sent!');
	}
	if (!chatId) {
		res.status(400);
		throw new Error('Chat cannot be null!');
	}

	let msg = await Message.create({ sender: req.user._id, content, chat: chatId });
	msg = await msg.populate('sender', 'name avatar').execPopulate();
	msg = await msg.populate('chat').execPopulate();
	msg = await User.populate(msg, {
		path: 'chat.users',
		select: 'name pic email',
	});

	await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: msg });

	res.status(201).send(msg);
});

export { getMessages, sendMessage };
