import multer from 'multer';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';

const storage = multer.diskStorage({
	destination: function (req, _file, cb) {
		if (!(req.body.title && req.body.description)) {
			cb(new Error('Title and description must be provided'), null);
		}
		const courseId = req.params.id;
		const path = `./uploads/resources/${courseId}`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename: function (req, file, cb) {
		if (!(req.body.title && req.body.description)) {
			cb(new Error('Title and description must be provided'), null);
		}
		cb(null, file.originalname);
	},
});

const fileFilter = (_req, file, cb) => {
	const allowedFiles = [
		'text/csv',
		'application/csv',
		'application/json',
		'text/plain',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
		'application/vnd.ms-excel',
		'application/vnd.ms-excel.sheet.macroEnabled.12',
		'application/msword',
		'application/vnd.ms-word.document.macroEnabled.12',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/html',
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/vnd.ms-powerpoint',
		'application/x-rar-compressed',
		'application/octet-stream',
		'application/zip',
		'application/octet-stream',
		'application/x-zip-compressed',
		'multipart/x-zip',
	];
	if (allowedFiles.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

export const access = asyncHandler(async (req, res, next) => {
	if (req.user.role !== 'Teacher') {
		res.status(401);
		throw new Error('Access denied! Only teachers can upload files!');
	}
	const course = await Course.findById(req.params.id).populate('teacher');
	if (!course.teacher._id.equals(req.user._id)) {
		res.status(401);
		throw new Error('Access denied! This is not your course!');
	}
	if (!course) {
		res.status(404);
		throw new Error('Course not found!');
	}
	next();
});
