import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
	destination: function (req, _file, cb) {
		const { _id } = req.user;
		const path = `./uploads/avatars/${_id}`;
		fs.mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename: function (_req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const fileFilter = (_req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
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
	fileFilter,
});
