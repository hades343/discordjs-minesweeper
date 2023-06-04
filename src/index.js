import 'dotenv/config';
import mongoose from 'mongoose';
import { registerSlashCommands } from './discord/registerCommands.js';
import { getClient } from './discord/client.js';
import { checkKeys } from './utils/checkKeys.js';
import { CLIENT_ID, TOKEN, DATABASE_URI, REQUIRED_ENV_VARIABLES } from './constants.js';

(async () => {
	try {
		const missingEnvVariables = checkKeys(process.env, REQUIRED_ENV_VARIABLES);
		if (missingEnvVariables.length !== 0) {
			const misssingVariablesString = missingEnvVariables.join(', ');
			const errorMessage = `The following environment variables are missing: ${misssingVariablesString}. Please ensure that these variables are properly set.`;
			throw new Error(errorMessage);
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
