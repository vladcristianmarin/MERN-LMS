import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
	chatName: { type: String, trim: true },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
	admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
