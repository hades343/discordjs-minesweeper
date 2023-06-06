import { EMOJIS } from '../../constants.js';

function parseInteraction({ user, message, customId, guildId }) {
	const [userId, challengerId] = message.content.match(/<@(\d+)>/g).map((a) => a.slice(2, -1));
	const [action, x, y] = customId.split('.');
	const [embed] = message.embeds;
	const gameData = getGameDataFromEmbed(embed.data);

	return {
		userId,
		guildId,
		challenger: challengerId ? `<@${challengerId}>` : null,
		isOwner: userId === user.id,
		action: {
			name: action,
			x,
			y,
		},
		gameData,
	};
}

function getGameDataFromEmbed(embed) {
	const [, x, y, ranked] = embed.title.match(/(\d+)x(\d+)(\s+RANKED)?/);
	const [, bombs, seed] = embed.footer.text.match(/Bomby:\s+(\d+)\s+•\s+Seed:\s+(\w+)/);
	const position = {
		x: null,
		y: null,
	};
	const rawGrid = embed.description.split('\n');
	const grid = rawGrid
		.map((row, i) => {
			const POSITION_EMOJIS = [EMOJIS.ARROWS.RIGHT, EMOJIS.ARROWS.LEFT];
			const newRow = row.match(/:(\w+):/g);

			if (i === 0 || i === rawGrid.length - 1) {
				const POSITION_EMOJIS = [EMOJIS.ARROWS.DOWN, EMOJIS.ARROWS.UP];
				const xPos = newRow.slice(1, -1).findIndex((emoji) => POSITION_EMOJIS.includes(emoji));
				position.x = xPos;
				return;
			}
			if (POSITION_EMOJIS.some((emoji) => newRow.includes(emoji))) {
				position.y = i - 1;
			}

			return newRow.slice(1, -1).map((emoji) => getKeyByValue(EMOJIS, emoji));
		})
		.slice(1, -1);

	return {
		rows: +x,
		cols: +y,
		bombs: +bombs,
		seed: seed,
		isRanked: !!ranked,
		timestamp: embed.timestamp,
		position,
		grid,
	};
}

function getKeyByValue(object, value) {
	for (const key in object) {
		const val = object[key];
		if (typeof val === 'object') {
			return getKeyByValue(val, value);
		} else if (value === val) {
			return key;
		}
	}
	return null;
}

export { parseInteraction };
