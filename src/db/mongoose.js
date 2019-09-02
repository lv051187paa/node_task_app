const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_ADDRESS, {
	useNewUrlParser: true,
	useCreateIndex: true
});
