import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { User } from '../models/User.js';
import { generateHexColor } from '../utils/generateHexColor.js';

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
			content: `Ranking z <t:${Math.floor(Date.now() / 1000)}:T>`,
			embeds: topUsers.map((user, i) =>
				new EmbedBuilder()
					.setColor(generateHexColor())
					.setTitle(`Pozycja w rankingu #${i + 1}`)
					.setDescription(`<@${user.user_id}>`)
					.setFields(
						{ name: `Rozegrane gry`, value: `${user.games}` },
						{ name: `Punkty`, value: `${Math.round(user.score)}` },
						{ name: `Winrate`, value: `${user.wr.toFixed(2)}` },
						{
							name: `Wygrane`,
							value: `${user.wins}`,
							inline: true,
						},
						{
							name: `Przegrane`,
							value: `${user.loses}`,
							inline: true,
						},
						{
							name: `Nieukończone`,
							value: `${user.games - (user.loses + user.wins)}`,
							inline: true,
						}
					)
					.setTimestamp()
			),
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
