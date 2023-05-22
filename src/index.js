const { Client, Events, GatewayIntentBits } = require('discord.js');
const { registerSlashCommands } = require('./registerCommands.js');
require('dotenv').config();

(async () => {
	try {
		const { CLIENT_ID, TOKEN } = process.env;
		if (!CLIENT_ID || !TOKEN) {
			throw new Error(
				'Missing CLIENT_ID or TOKEN environment variable. Please ensure that both variables are set.'
			);
		}
		const commandsCollection = await registerSlashCommands(CLIENT_ID, TOKEN);

		const client = new Client({ intents: [GatewayIntentBits.Guilds] });
		client.commands = commandsCollection;

		client.once(Events.ClientReady, (client) => {
			console.log(`Ready! Logged in as ${client.user.tag}`);
		});
		client.on(Events.InteractionCreate, async (interaction) => {
			try {
				if (!interaction.isChatInputCommand()) {
					return;
				}
				const command = interaction.client.commands.get(
					interaction.commandName
				);
				if (!command) {
					return;
				}
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'There was an error while executing this command!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: 'There was an error while executing this command!',
						ephemeral: true,
					});
				}
			}
		});

		client.login(TOKEN);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
