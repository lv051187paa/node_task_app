const { MongoClient, ObjectID } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
	if (error) {
		return console.log('Unable to connect to database');
	}

	const db = client.db(databaseName);

	db
		.collection('tasks')
		.deleteOne({ description: 'Learn Angular' })
		.then(result => console.log(result))
		.catch(err => console.log(err));
});
