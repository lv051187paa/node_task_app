const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const router = new express.Router();

const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		//  cb(new Error('File must be an image'))
		//  cb(undefined, true)
		//  cb(undefined, false)
		if (!file.originalname.match(/\.(jp(e?)g|png)$/g)) {
			cb(new Error('File must be an image'));
		}

		cb(undefined, true);
	}
});

router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (err) {
		res.status(400).send(err.message);
	}
});

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
		await req.user.save();
		res.send();
	} catch (err) {
		res.status(500).send(err);
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isValidIperations = updates.every(update => {
		return allowedUpdates.includes(update);
	});

	if (!isValidIperations) {
		return res.status(400).send({
			error: 'Invalid updates'
		});
	}

	try {
		// const _id = req.user.id;
		// const user = await User.findByIdAndUpdate(_id, req.body, {
		// 	new: true,
		// 	runValidators: true
		// });

		const user = req.user;
		updates.forEach(update => (user[update] = req.body[update]));

		await user.save();

		res.send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		// const _id = req.user._id;
		// const user = await User.findByIdAndDelete(_id);
		await req.user.remove();
		sendCancelationEmail(req.user.email, req.user.name);
		res.send(req.user);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();

		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();
		res.send();
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw Error();
		}

		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (err) {
		res.status(404).send();
	}
});

module.exports = router;
