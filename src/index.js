const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
// 	res.status(503).send('Site is under reconstruction');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server runs on ${port}...`);
});

const Task = require('./models/task');
const User = require('./models/user');

// const main = async () => {
// 	// const task = await Task.findById('5d6acf04dc9ac03c6cd5a9c9');
// 	// await task.populate('owner').execPopulate();
// 	// console.log(task.owner);

// 	const user = await User.findById('5d6ace50fee5ad4fec53156a');
// 	await user.populate('tasks').execPopulate();
// 	console.log(user.tasks);
// };

// main();
