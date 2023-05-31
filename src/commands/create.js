import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { getChannelById, createThread, getUserData } from '../game/utils/index.js';
import { Game } from '../game/Game.js';

const GUILD_CHANNEL_MAPPING_FILE = path.resolve(process.cwd(), 'src', 'commands', 'guild_channel_mapping.json');
const GUILD_CHANNEL_MAPPING = JSON.parse(fs.readFileSync(GUILD_CHANNEL_MAPPING_FILE).toString());
const MAX_ROWS = 11;
const MAX_COLS = 11;
const MAX_BOMBS = MAX_COLS * MAX_ROWS - 1;
const DEFAULT_BOMBS = 20;
const ACTIVE_TAG_NAME = 'AKTYWNA';

export const command = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Starts a new Minesweeper game')
		.addIntegerOption((option) =>
			option
				.setName('rows')
				.setDescription(`Number of rows for the game board (default: ${MAX_ROWS})`)
				.setMinValue(2)
				.setMaxValue(MAX_ROWS)
		)
		.addIntegerOption((option) =>
			option
				.setName('cols')
				.setDescription(`Number of columns for the game board (default: ${MAX_COLS})`)
				.setMinValue(2)
				.setMaxValue(MAX_COLS)
		)
		.addIntegerOption((option) =>
			option
				.setName('bombs')
				.setDescription(`Number of bombs on the game board (default: ${DEFAULT_BOMBS})`)
				.setMinValue(1)
				.setMaxValue(MAX_BOMBS)
		)
		.addMentionableOption((option) =>
			option.setName('challenge').setDescription('Starts a challenge game for the specified user')
		)
		.addStringOption((option) => option.setName('seed').setDescription('Starts a game with the given seed')),
	async execute(interaction) {
		const rows = interaction.options.getInteger('rows') ?? MAX_ROWS;
		const cols = interaction.options.getInteger('cols') ?? MAX_COLS;
		const bombs = interaction.options.getInteger('bombs') ?? DEFAULT_BOMBS;
		const challenge = interaction.options.getMentionable('challenge');
		const seed = interaction.options.getString('seed');
		// prettier-ignore
		const isRanked =
			rows === MAX_ROWS
			&& cols === MAX_COLS
			&& bombs === DEFAULT_BOMBS
			&& seed === null
			&& challenge === null;

		if (!GUILD_CHANNEL_MAPPING[interaction.guildId]) {
			return await interaction.reply({
				content: 'The forum channel has not been set for your guild.',
				ephemeral: true,
			});
		}
		if (challenge !== null) {
			if (challenge.role || challenge.user.bot || challenge.user.system) {
				return await interaction.reply({
					content: 'Please mention a valid user for the challenge!',
					ephemeral: true,
				});
			}
			if (challenge.id === interaction.member.id) {
				return await interaction.reply({
					content: "You can't challenge yourself!",
					ephemeral: true,
				});
			}
		}
		if (bombs > rows * cols - 1) {
			return await interaction.reply({
				content: 'The number of bombs exceeds the available cells.',
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
			seed,
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
			content: `Game has been created in ${thread}`,
			ephemeral: true,
		});
	},
};
