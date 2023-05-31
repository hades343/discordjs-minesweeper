import { EMOJIS } from './emojis.js';

const TILE_STATES = {
	HIDDEN: 'hidden',
	BOMB: 'bomb',
	EXPLODED: 'exploded',
	REVEALED: 'revealed',
	MARKED: 'marked',
};

class Tile {
	constructor({ x, y, isBomb }) {
		this.x = x;
		this.y = y;
		this.isBomb = isBomb;
		this.state = TILE_STATES.HIDDEN;
		this.adjacentBombs = null;
	}

	setState(state) {
		this.state = state;
	}

	toString() {
		switch (this.state) {
			case TILE_STATES.BOMB:
				return EMOJIS.BOMB;
			case TILE_STATES.EXPLODED:
				return EMOJIS.BOOM;
			case TILE_STATES.REVEALED:
				return this.adjacentBombs === null ? EMOJIS.WHITE_SQUARE : EMOJIS.NUMBERS[this.adjacentBombs];
			case TILE_STATES.MARKED:
				return EMOJIS.FLAG;
			default:
				return EMOJIS.BLACK_SQUARE;
		}
	}
}

export { Tile, TILE_STATES };
