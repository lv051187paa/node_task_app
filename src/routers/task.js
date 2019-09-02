const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: req.user._id
	});
	try {
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(400).send(err);
	}
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
	try {
		const match = {};
		const sort = {};

		if (req.query.completed) {
			match.completed = req.query.completed === 'true';
		}

		if (req.query.sortBy) {
			const parts = req.query.sortBy.split('_');
			sort[parts[0]] = parts[1].toLowerCase() === 'desc' ? -1 : 1;
		}
		// const tasks = await Task.find({ owner: req.user._id, completed: false });
		await req.user
			.populate({
				path: 'tasks',
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort
				}
			})
			.execPopulate();
		res.send(req.user.tasks);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findOne({ _id, owner: req.user._id });
		if (!task) {
			return res.status(404).send();
		}
		res.send(task);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidIperations = updates.every(update => {
		return allowedUpdates.includes(update);
	});

	if (!isValidIperations) {
		return res.status(400).send({
			error: 'Invalid updates'
		});
	}

	try {
		const _id = req.params.id;
		// const task = await Task.findByIdAndUpdate(_id, req.body, {
		// 	new: true,
		// 	runValidators: true
		// });

		const task = await Task.findOne({ _id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}

		updates.forEach(update => (task[update] = req.body[update]));

		await task.save();

		res.send(task);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const _id = req.params.id;
		const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}

		res.send(task);
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
