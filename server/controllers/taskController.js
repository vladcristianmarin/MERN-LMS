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
		task: req.body.task,
		done: false,
	});

	if (!createdTask) {
		res.status(400);
		throw new Error('Invalid task data!');
	}

	res.status(201).send(createdTask);
});

//PATCH

export const doneTask = asyncHandler(async (req, res) => {
	const updatedTask = await Task.findByIdAndUpdate(req.body.taskId, { done: req.body.done });
	if (!updatedTask) {
		res.status(400);
		throw new Error('Invalid task id!');
	}
	res.send();
});

//DELETE

export const deleteTask = asyncHandler(async (req, res) => {
	const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
	if (!deletedTask) {
		res.status(400);
		throw new Error('Invalid task id!');
	}
	res.send();
});
