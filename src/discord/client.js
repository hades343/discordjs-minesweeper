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
				return command.execute(interaction);
			} else if (interaction.isButton()) {
				return handleGameInteraction(interaction);
			}
		} catch (error) {
			// console.error(error);
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

	return client;
}

export { getClient };
