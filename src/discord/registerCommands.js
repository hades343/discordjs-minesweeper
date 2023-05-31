import fs from 'fs';
import path from 'path';
import { REST, Routes, Collection } from 'discord.js';

const COMMANDS_CACHE_FILE = './commands_cache.json';
const COMMANDS_CACHE = fs.existsSync(COMMANDS_CACHE_FILE) ? fs.readFileSync(COMMANDS_CACHE_FILE).toString() : null;

async function registerSlashCommands(clientId, token) {
	const COMMANDS_DIR = path.resolve(process.cwd(), 'src', 'commands');
	const rest = new REST({ version: '10' }).setToken(token);
	const commands = [];
	const commandFiles = fs.readdirSync(COMMANDS_DIR).filter((file) => file.endsWith('.js'));
	const commandsCollection = new Collection();

	for (const file of commandFiles) {
		const filePath = `${process.platform === 'win32' ? 'file://' : ''}${path.resolve(COMMANDS_DIR, file)}`;
		const { command } = await import(filePath);
		if (!('data' in command && 'execute' in command)) {
			console.warn(`Invalid command file at path: ${filePath}`);
			continue;
		}
		commandsCollection.set(command.data.name, command);
		commands.push(command.data.toJSON());
	}

	if (!COMMANDS_CACHE || JSON.stringify(commands) !== COMMANDS_CACHE) {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});
		fs.writeFileSync(COMMANDS_CACHE_FILE, JSON.stringify(commands));
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}

	return commandsCollection;
}

export { registerSlashCommands };
