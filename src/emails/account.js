const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'lv051187paa@gmail.com',
		subject: 'Welcome to the app',
		text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
	});
};

const sendCancelationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'lv051187paa@gmail.com',
		subject: 'Good bye',
		text: `Good bye, ${name}. Is there anything we can do for you returning?`
	});
};

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail
};
