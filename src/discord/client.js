import { Client, Events, GatewayIntentBits } from 'discord.js';
import { handleGameInteraction } from '../game/Game.js';

function getClient(commandsCollection) {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });
	client.commands = commandsCollection;

	client.once(Events.ClientReady, (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	});

	client.on(Events.InteractionCreate, async (interaction) => {
		try {
			if (interaction.isChatInputCommand()) {
				const command = interaction.client.commands.get(interaction.commandName);
				if (!command) {
					return;
				}
				return await command.execute(interaction);
			} else if (interaction.isButton()) {
				return await handleGameInteraction(interaction);
			}
		} catch (error) {
			if (interaction.replied || interaction.deferred) {
				return interaction
					.followUp({
						content: 'There was an error while executing this command!',
						ephemeral: true,
					})
					.catch(() => {});
			} else {
				return interaction
					.reply({
						content: 'There was an error while executing this command!',
						ephemeral: true,
					})
					.catch(() => {});
			}
		}
	});

	return client;
}

export { getClient };
