import 'dotenv/config';
import mongoose from 'mongoose';
import { registerSlashCommands } from './discord/registerCommands.js';
import { getClient } from './discord/client.js';

(async () => {
	try {
		const { CLIENT_ID, TOKEN, DATABASE_URI } = process.env;
		if (!CLIENT_ID || !TOKEN || !DATABASE_URI) {
			throw new Error('One of environment variables is missing. Please ensure that both variables are set.');
		}
		await mongoose.connect(DATABASE_URI);

		const commandsCollection = await registerSlashCommands(CLIENT_ID, TOKEN);
		const client = getClient(commandsCollection);

		client.login(TOKEN);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
