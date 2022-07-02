import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';

//GET

export const fetchEvents = asyncHandler(async (req, res) => {
	const events = await Event.find({ user: req.user._id });
	res.send(events);
});

//PUT

export const createEvent = asyncHandler(async (req, res) => {
	const createdEvent = await Event.create({
		user: req.user._id,
		title: req.body.title,
		allDay: req.body.allDay,
		date: req.body.date,
	});

	if (!createdEvent) {
		res.status(400);
		throw new Error('Invalid event data!');
	}

	res.status(201).send();
});

//DELETE

export const deleteEvent = asyncHandler(async (req, res) => {
	const deletedEvent = await Event.findByIdAndDelete(req.body.eventId);
	if (!deletedEvent) {
		res.status(400);
		throw new Error('Invalid event id!');
	}
	res.send();
});
