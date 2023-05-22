const fs = require('fs');
const path = require('path');
const { REST, Routes, Collection } = require('discord.js');

async function registerSlashCommands(clientId, token) {
	const COMMANDS_DIR = path.resolve(process.cwd(), 'src', 'commands');
	const commands = [];
	const commandFiles = fs
		.readdirSync(COMMANDS_DIR)
		.filter((file) => file.endsWith('.js'));
	const commandsCollection = new Collection();

	for (const file of commandFiles) {
		const filePath = path.resolve(COMMANDS_DIR, file);
		const command = require(filePath);
		if (!('data' in command && 'execute' in command)) {
			console.warn(`Invalid command file at path: ${filePath}`);
			continue;
		}
		commandsCollection.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: '10' }).setToken(token);
	console.log(
		`Started refreshing ${commands.length} application (/) commands.`
	);
	const data = await rest.put(Routes.applicationCommands(clientId), {
		body: commands,
	});
	console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	return commandsCollection;
}

module.exports = {
	registerSlashCommands,
};
