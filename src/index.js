const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Server runs on ${port}...`);
});

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
// 	// const task = await Task.findById('5d6acf04dc9ac03c6cd5a9c9');
// 	// await task.populate('owner').execPopulate();
// 	// console.log(task.owner);

// 	const user = await User.findById('5d6ace50fee5ad4fec53156a');
// 	await user.populate('tasks').execPopulate();
// 	console.log(user.tasks);
// };

// main();
