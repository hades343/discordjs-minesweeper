import { EMOJIS } from '../emojis.js';

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
	const grid = embed.description
		.split('\n')
		.slice(1, -1)
		.map((row, i) => {
			const POSITION_EMOJIS = [EMOJIS.YELLOW_SQUARE, EMOJIS.ORANGE_SQUARE, EMOJIS.RED_SQUARE];
			const newRow = row.match(/:(\w+):/g).slice(1, -1);
			if (POSITION_EMOJIS.some((emoji) => newRow.includes(emoji))) {
				position.y = i;
				position.x = newRow.findIndex((emoji) => POSITION_EMOJIS.includes(emoji));
			}
			return newRow.map((emoji) => getKeyByValue(EMOJIS, emoji));
		});

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
