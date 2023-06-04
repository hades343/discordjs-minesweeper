import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { getChannelById, createThread, getUserData } from '../game/utils/index.js';
import { Game } from '../game/Game.js';
import { MAX_ROWS, MAX_COLS, DEFAULT_BOMBS, ACTIVE_TAG_NAME } from '../constants.js';

const GUILD_CHANNEL_MAPPING_FILE = path.resolve(process.cwd(), 'src', 'commands', 'guild_channel_mapping.json');
const GUILD_CHANNEL_MAPPING = JSON.parse(fs.readFileSync(GUILD_CHANNEL_MAPPING_FILE).toString());
const MAX_BOMBS = MAX_ROWS * MAX_COLS - 1;

export const command = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Tworzy nową plansze sapera')
		.addIntegerOption((option) =>
			option
				.setName('rows')
				.setDescription(`Liczba wierszy (default: ${MAX_ROWS})`)
				.setMinValue(2)
				.setMaxValue(+MAX_ROWS)
		)
		.addIntegerOption((option) =>
			option
				.setName('cols')
				.setDescription(`Liczba kolumn (default: ${MAX_COLS})`)
				.setMinValue(2)
				.setMaxValue(+MAX_COLS)
		)
		.addIntegerOption((option) =>
			option
				.setName('bombs')
				.setDescription(`Liczba bomb (default: ${DEFAULT_BOMBS})`)
				.setMinValue(1)
				.setMaxValue(MAX_BOMBS)
		)
		.addMentionableOption((option) =>
			option.setName('challenge').setDescription('Tworzy wyzwanie dla wskazanego gracza')
		),
	async execute(interaction) {
		const rows = interaction.options.getInteger('rows') ?? +MAX_ROWS;
		const cols = interaction.options.getInteger('cols') ?? +MAX_COLS;
		const bombs = interaction.options.getInteger('bombs') ?? +DEFAULT_BOMBS;
		const challenge = interaction.options.getMentionable('challenge');
		// prettier-ignore
		const isRanked =
			rows == MAX_ROWS
			&& cols == MAX_COLS
			&& bombs == DEFAULT_BOMBS
			&& challenge === null;

		if (!GUILD_CHANNEL_MAPPING[interaction.guildId]) {
			return await interaction.reply({
				content: 'Kanał forum nie został ustawiony dla twojego serwera',
				ephemeral: true,
			});
		}
		if (challenge !== null) {
			if (challenge.role || challenge.user.bot || challenge.user.system) {
				return await interaction.reply({
					content: 'Podaj właściwego użytkownika',
					ephemeral: true,
				});
			}
			if (challenge.id === interaction.member.id) {
				return await interaction.reply({
					content: 'Nie możesz stworzyć wyzwania dla siebie',
					ephemeral: true,
				});
			}
		}
		if (bombs > rows * cols - 1) {
			return await interaction.reply({
				content: `Podałeś za dużo bomb (liczba pól: ${rows * cols}, liczba bomb: ${bombs})`,
				ephemeral: true,
			});
		}

		if (isRanked) {
			const user = await getUserData({ user_id: interaction.member.id, guild_id: interaction.guildId });
			user.games++;
			await user.save();
		}

		const game = new Game({
			rows,
			cols,
			bombs,
			isRanked,
			position: {
				x: 0,
				y: 0,
			},
		});

		const forum = getChannelById(interaction.client, GUILD_CHANNEL_MAPPING[interaction.guildId]);
		const thread = await createThread(
			forum,
			game.getBaseEmbed(interaction.member, challenge),
			`Plansza użytkownika ${(challenge ? challenge : interaction.member).user.tag}`,
			forum.availableTags.filter((tag) => tag.name === ACTIVE_TAG_NAME).map((tag) => tag.id)
		);

		return interaction.reply({
			content: `Gra stworzona w ${thread}`,
			ephemeral: true,
		});
	},
};
