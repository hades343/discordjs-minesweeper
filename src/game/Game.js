import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Tile, TILE_STATES } from './Tile.js';
import {
	generateSeed,
	getSeededRandomGenerator,
	parseInteraction,
	getUserData,
	getChannelById,
} from './utils/index.js';
import { EMOJIS } from './emojis.js';

const GAME_STATES = {
	WIN: 'win',
	LOSE: 'lose',
	ACTIVE: 'active',
};

const EMBED_COLORS = {
	BLUE: 0x0099ff,
	RED: 0xff0000,
	GREEN: 0x00ff00,
};

const WIN_TAG_NAME = 'WYGRANA';
const LOSE_TAG_NAME = 'PRZEGRANA';

class Game {
	constructor({ rows, cols, seed, bombs, isRanked, position }) {
		this.rows = rows;
		this.cols = cols;
		this.seed = seed ?? generateSeed();
		this.bombs = bombs;
		this.isRanked = isRanked;
		this.position = position;
		this.state = GAME_STATES.ACTIVE;
		this.grid = this.createGrid();
	}

	createGrid() {
		const grid = [];
		const bombs = this.getBombs();
		for (let y = 0; y < this.cols; y++) {
			grid[y] = [];
			for (let x = 0; x < this.rows; x++) {
				grid[y][x] = new Tile({
					x,
					y,
					isBomb: !!bombs.find((bomb) => bomb.x === x && bomb.y === y),
				});
			}
		}

		return grid;
	}

	getBombs() {
		const bombs = [];
		const seededRandomGenerator = getSeededRandomGenerator(this.seed);

		while (bombs.length < this.bombs) {
			const x = Math.floor(seededRandomGenerator() * this.rows);
			const y = Math.floor(seededRandomGenerator() * this.cols);

			if (bombs.find((bomb) => bomb.x === x && bomb.y === y)) {
				continue;
			}

			bombs.push({
				x,
				y,
			});
		}

		return bombs;
	}

	getCurrentTile() {
		const { x, y } = this.position;
		return this.grid[y][x];
	}

	getAdjacentTiles(tile) {
		const adjacentTiles = [];

		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			for (let xOffset = -1; xOffset <= 1; xOffset++) {
				const y = tile.y + yOffset;
				const x = tile.x + xOffset;
				if (y < 0 || x < 0) {
					continue;
				}
				if (y > this.cols - 1 || x > this.rows - 1) {
					continue;
				}
				const adjacentTile = this.grid[y][x];
				adjacentTiles.push(adjacentTile);
			}
		}

		return adjacentTiles;
	}

	revealTile(tile) {
		if (tile.state !== TILE_STATES.HIDDEN) {
			return;
		}
		if (tile.isBomb) {
			this.state = GAME_STATES.LOSE;
			return this.revealAllTiles();
		}

		const adjacentTiles = this.getAdjacentTiles(tile);
		const bombs = adjacentTiles.filter((tile) => tile.isBomb);
		tile.setState(TILE_STATES.REVEALED);

		if (bombs.length === 0) {
			adjacentTiles.forEach((tile) => this.revealTile(tile));
		} else {
			tile.adjacentBombs = bombs.length;
			tile.setState(TILE_STATES.REVEALED);
		}

		if (this.checkIsWin()) {
			this.state = GAME_STATES.WIN;
			return this.revealAllTiles();
		}
	}

	revealAllTiles() {
		for (const row of this.grid) {
			for (const tile of row) {
				if (tile.isBomb) {
					tile.setState(this.state === GAME_STATES.WIN ? TILE_STATES.BOMB : TILE_STATES.EXPLODED);
					continue;
				}
				if (tile.state !== TILE_STATES.REVEALED) {
					const adjacentTiles = this.getAdjacentTiles(tile);
					const bombs = adjacentTiles.filter((tile) => tile.isBomb);
					tile.adjacentBombs = bombs.length || null;
					tile.setState(TILE_STATES.REVEALED);
				}
			}
		}
	}

	checkIsWin() {
		return this.grid.every((row) =>
			row.every(
				(tile) =>
					tile.state === TILE_STATES.REVEALED ||
					(tile.isBomb && [TILE_STATES.HIDDEN, TILE_STATES.MARKED].includes(tile.state))
			)
		);
	}

	markTile(tile) {
		if (tile.state === TILE_STATES.MARKED) {
			tile.setState(TILE_STATES.HIDDEN);
		} else {
			tile.setState(TILE_STATES.MARKED);
		}
	}

	createButtons(marked) {
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x - 1}.${this.position.y - 1}`)
					.setEmoji('↖️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.x - 1 < 0 || this.position.y - 1 < 0),
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x}.${this.position.y - 1}`)
					.setEmoji('⬆️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.y - 1 < 0),
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x + 1}.${this.position.y - 1}`)
					.setEmoji('↗️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.x + 1 >= this.rows || this.position.y - 1 < 0),
				new ButtonBuilder()
					.setCustomId(`mark.${this.position.x}.${this.position.y}`)
					.setEmoji('🚩')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(
						// prettier-ignore
						(
							marked + 1 > this.bombs
							&& this.getCurrentTile().state === TILE_STATES.HIDDEN
						) 
						|| this.getCurrentTile().state === TILE_STATES.REVEALED
					)
			),
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x - 1}.${this.position.y}`)
					.setEmoji('⬅️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.x - 1 < 0),
				new ButtonBuilder().setCustomId(`nothing`).setEmoji('⬛').setStyle(ButtonStyle.Secondary).setDisabled(true),
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x + 1}.${this.position.y}`)
					.setEmoji('➡️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.x + 1 >= this.rows),
				new ButtonBuilder()
					.setCustomId(`check.${this.position.x}.${this.position.y}`)
					.setEmoji('✅')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(this.getCurrentTile().state !== TILE_STATES.HIDDEN)
			),
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x - 1}.${this.position.y + 1}`)
					.setEmoji('↙️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.x - 1 < 0 || this.position.y + 1 >= this.cols),
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x}.${this.position.y + 1}`)
					.setEmoji('⬇️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.y + 1 >= this.cols),
				new ButtonBuilder()
					.setCustomId(`move.${this.position.x + 1}.${this.position.y + 1}`)
					.setEmoji('↘️')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(this.position.x + 1 >= this.rows || this.position.y + 1 >= this.cols)
			),
		];
	}

	getEmbedData() {
		const grid = [];
		let hidden = 0;
		let marked = 0;

		grid.push(
			Array.from({ length: this.rows + 2 }, (_, i) => {
				return i - 1 === this.position.x ? EMOJIS.ARROWS.DOWN : EMOJIS.BLUE_SQUARE;
			})
		);
		for (let y = 0; y < this.cols; y++) {
			const row = [];
			row.push(y === this.position.y ? EMOJIS.ARROWS.RIGHT : EMOJIS.BLUE_SQUARE);
			for (let x = 0; x < this.rows; x++) {
				const tile = this.grid[y][x];
				if (tile.state === TILE_STATES.HIDDEN) {
					hidden++;
				}
				if (tile.state === TILE_STATES.MARKED) {
					marked++;
				}
				row.push(
					this.getCurrentTile() === tile && this.state === GAME_STATES.ACTIVE
						? tile.state === TILE_STATES.REVEALED
							? EMOJIS.ORANGE_SQUARE
							: tile.state === TILE_STATES.MARKED
							? EMOJIS.RED_SQUARE
							: EMOJIS.YELLOW_SQUARE
						: tile.toString()
				);
			}
			row.push(y === this.position.y ? EMOJIS.ARROWS.LEFT : EMOJIS.BLUE_SQUARE);
			grid.push(row);
		}
		grid.push(
			Array.from({ length: this.rows + 2 }, (_, i) => {
				return i - 1 === this.position.x ? EMOJIS.ARROWS.UP : EMOJIS.BLUE_SQUARE;
			})
		);

		return {
			hidden,
			marked,
			grid: grid.map((row) => row.join('')).join('\n'),
		};
	}

	getBaseEmbed(member, challenge, timestamp) {
		const { hidden, marked, grid } = this.getEmbedData();

		const embed = {
			content: `${
				this.state === GAME_STATES.ACTIVE
					? challenge
						? `Plansza gracza ${challenge} (wyzwanie od gracza ${member})`
						: `Plansza gracza ${member}`
					: null
			}`,
			embeds: [
				new EmbedBuilder()
					.setColor(
						this.state === GAME_STATES.ACTIVE
							? EMBED_COLORS.BLUE
							: this.state === GAME_STATES.WIN
							? EMBED_COLORS.GREEN
							: EMBED_COLORS.RED
					)
					.setTitle(`Saper ${this.rows}x${this.cols}${this.isRanked ? ` RANKED` : ''}`)
					.setDescription(grid)
					.setTimestamp(timestamp)
					.setFooter({ text: `Bomby: ${this.bombs} • Seed: ${this.seed}` })
					.setFields(
						{ name: `${EMOJIS.FLAG} Flagi`, value: `${marked} / ${this.bombs}`, inline: true },
						{ name: `${EMOJIS.BLACK_SQUARE} Nieodkryte`, value: `${hidden}`, inline: true },
						{
							name: `Pozostałe pola`,
							value: `${this.state === GAME_STATES.ACTIVE ? hidden + marked - this.bombs : 0}`,
						}
					),
			],
			components: this.createButtons(marked),
		};

		return embed;
	}

	handleAction({ name, x, y }) {
		if (name === 'move') {
			this.position.x = +x;
			this.position.y = +y;
		} else if (name === 'check') {
			const tile = this.getCurrentTile();
			this.revealTile(tile);
		} else if (name === 'mark') {
			const tile = this.getCurrentTile();
			this.markTile(tile);
		}
	}
}

async function handleGameInteraction(interaction) {
	const { userId, guildId, challenger, isOwner, action, gameData } = parseInteraction(interaction);

	if (!isOwner) {
		return await interaction.reply({
			content: 'You do not have permission to access this board!',
			ephemeral: true,
		});
	}

	const game = new Game({
		rows: gameData.rows,
		cols: gameData.cols,
		seed: gameData.seed,
		bombs: gameData.bombs,
		isRanked: gameData.isRanked,
		position: gameData.position,
	});

	for (let y = 0; y < gameData.cols; y++) {
		for (let x = 0; x < gameData.rows; x++) {
			const value = gameData.grid[y][x];
			const tile = game.grid[y][x];
			if (value === 'BOOM') {
				tile.setState(TILE_STATES.BOMB);
			} else if (value === 'FLAG' || value === 'RED_SQUARE') {
				tile.setState(TILE_STATES.MARKED);
			} else if ((typeof +value === 'number' && !isNaN(+value)) || ['ORANGE_SQUARE', 'WHITE_SQUARE'].includes(value)) {
				game.revealTile(tile);
			}
		}
	}
	game.handleAction(action);

	const baseEmbed = game.getBaseEmbed(
		challenger ? challenger : interaction.member,
		challenger ? interaction.member : challenger,
		new Date(gameData.timestamp)
	);

	if (game.state !== GAME_STATES.ACTIVE) {
		const thread = getChannelById(interaction.client, interaction.channelId);
		const forum = getChannelById(interaction.client, thread.parentId);

		if (game.state === GAME_STATES.WIN) {
			baseEmbed.content = `Gratulacje wygrałeś ${interaction.member}!`;
		} else {
			baseEmbed.content = `Niestety przegrałeś ${interaction.member}!`;
		}
		if (game.isRanked) {
			const user = await getUserData({ user_id: userId, guild_id: guildId });
			if (game.state === GAME_STATES.WIN) {
				user.wins++;
				baseEmbed.content += ` Jest to twoja ${user.wins} wygrana.`;
			} else {
				user.loses++;
				baseEmbed.content += ` Jest to twoja ${user.loses} przegrana.`;
			}
			await user.save();
		}

		await thread.setAppliedTags(
			forum.availableTags
				.filter((tag) => tag.name === (game.state === GAME_STATES.WIN ? WIN_TAG_NAME : LOSE_TAG_NAME))
				.map((tag) => tag.id)
		);
		await interaction.update(baseEmbed);
		return thread.edit({
			archived: true,
			locked: true,
		});
	}

	return interaction.update(baseEmbed);
}

export { Game, handleGameInteraction };
