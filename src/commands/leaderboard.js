import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { User } from '../models/User.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Wyświetla liste top 10 graczy sapera na serwerze'),
	async execute(interaction) {
		const users = await User.find({ guild_id: interaction.guildId });
		const topUsers = users.sort((a, b) => b.score - a.score).slice(0, 10);

		if (users.length === 0) {
			return interaction.reply({
				content: `Brak danych dla twojego serwera`,
				ephemeral: true,
			});
		}

		const embed = {
			content: 'Ranking graczy sapera',
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Lista top 10 graczy`)
					.setDescription(
						topUsers
							.map((user, i) => `${i + 1}. <@${user.user_id}> - ${user.score} punktów (${user.wr}% wr)`)
							.join('\n')
					)
					.setTimestamp(),
			],
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
