import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { User } from '../models/User.js';
import { generateHexColor } from '../utils/generateHexColor.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Sprawdza statystyki użykownika')
		.addMentionableOption((option) => option.setName('user').setDescription('Użytkownik do sprawdzenia')),
	async execute(interaction) {
		const userId = (interaction.options.getMentionable('user') ?? interaction.member).user.id;
		const users = await User.find({ guild_id: interaction.guildId });
		const user = users.find((user) => user.user_id === userId);

		if (users.length === 0) {
			return interaction.reply({
				content: `Brak danych dla twojego serwera`,
				ephemeral: true,
			});
		}
		if (!user) {
			return interaction.reply({
				content: `Ten gracz nie rozegrał żadnej gry`,
				ephemeral: true,
			});
		}

		const userStanding = users.sort((a, b) => b.score - a.score).findIndex((user) => user.user_id === userId) + 1;

		const embed = {
			content: `Dane z <t:${Math.floor(Date.now() / 1000)}:T>`,
			embeds: [
				new EmbedBuilder()
					.setColor(generateHexColor())
					.setTitle(`Pozycja w rankingu #${userStanding}`)
					.setDescription(`<@${userId}>`)
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
					.setTimestamp(),
			],
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
