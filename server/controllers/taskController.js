import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

//GET

export const fetchTasks = asyncHandler(async (req, res) => {
	const tasks = await Task.find({ user: req.user._id });
	res.send(tasks);
});

//PUT

export const createTask = asyncHandler(async (req, res) => {
	const createdTask = await Task.create({
		user: req.user._id,
		title: req.body._id,
		done: false,
	});

	if (!createdTask) {
		res.status(400);
		throw new Error('Invalid task data!');
	}

	res.status(201).send();
});

//PATCH

export const doneTask = asyncHandler(async (req, res) => {
	const updatedTask = await Task.findByIdAndUpdate(req.body.taskId, { done: true });
	if (!updatedTask) {
		res.status(400);
		throw new Error('Invalid task id!');
	}
	res.send();
});

//DELETE

export const deleteTask = asyncHandler(async (req, res) => {
	const deletedTask = await Task.findByIdAndDelete(req.body.taskId);
	if (!deletedTask) {
		res.status(400);
		throw new Error('Invalid task id!');
	}
	res.send();
});
