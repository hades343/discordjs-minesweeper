import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { User } from '../models/User.js';

export const command = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check user stats')
		.addMentionableOption((option) => option.setName('user').setDescription('Select a user to check their stats')),
	async execute(interaction) {
		const userId = (interaction.options.getMentionable('user') ?? interaction.member).user.id;
		const users = await User.find({ guild_id: interaction.guildId });
		const user = users.find((user) => user.user_id === userId);

		if (users.length === 0) {
			return interaction.reply({
				content: `There is no user data available for your guild.`,
				ephemeral: true,
			});
		}
		if (!user) {
			return interaction.reply({
				content: `This user has not played any game yet.`,
				ephemeral: true,
			});
		}

		const userStanding = users.sort((a, b) => b.score - a.score).findIndex((user) => user.user_id === userId) + 1;

		const embed = {
			content: 'Ranga gracza',
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Twój wynik`)
					.setDescription(`${userStanding}. <@${userId}> - ${user.score} punktów (${user.wr}% wr)`)
					.setTimestamp(),
			],
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
