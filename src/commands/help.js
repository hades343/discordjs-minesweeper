import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { EMOJIS_MEANING } from '../constants.js';

export const command = {
	data: new SlashCommandBuilder().setName('help').setDescription('Wyświetla znaczenie wszystkich pól z planszy'),
	async execute(interaction) {
		const embed = {
			content: 'Wyjaśnienie gry',
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Znaczenie pól na planszy`)
					.setDescription(
						Object.entries(EMOJIS_MEANING)
							.map(([emoji, meaning]) => `${emoji} - ${meaning}`)
							.join('\n')
					)
					.setTimestamp(),
			],
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
