export const {
	CLIENT_ID,
	TOKEN,
	DATABASE_URI,
	SEED_SECRET,
	MAX_ROWS,
	MAX_COLS,
	DEFAULT_BOMBS,
	ACTIVE_TAG_NAME,
	WIN_TAG_NAME,
	LOSE_TAG_NAME,
} = process.env;

export const EMOJIS = {
	BOMB: ':bomb:',
	BOOM: ':boom:',
	FLAG: ':triangular_flag_on_post:',
	BLUE_SQUARE: ':blue_square:',
	WHITE_SQUARE: ':white_large_square:',
	BLACK_SQUARE: ':black_large_square:',
	YELLOW_SQUARE: ':yellow_square:',
	RED_SQUARE: ':red_square:',
	PURPLE_SQUARE: ':purple_square:',
	GREEN_SQUARE: ':green_square:',
	NUMBERS: {
		1: ':one:',
		2: ':two:',
		3: ':three:',
		4: ':four:',
		5: ':five:',
		6: ':six:',
		7: ':seven:',
		8: ':eight:',
	},
	ARROWS: {
		UP: ':arrow_up:',
		DOWN: ':arrow_down:',
		LEFT: ':arrow_left:',
		RIGHT: ':arrow_right:',
	},
};

export const TILE_STATES = {
	HIDDEN: 'hidden',
	BOMB: 'bomb',
	EXPLODED: 'exploded',
	REVEALED: 'revealed',
	MARKED: 'marked',
};

export const GAME_STATES = {
	WIN: 'win',
	LOSE: 'lose',
	ACTIVE: 'active',
};

export const EMBED_COLORS = {
	BLUE: 0x0099ff,
	RED: 0xff0000,
	GREEN: 0x00ff00,
};

export const REQUIRED_ENV_VARIABLES = [
	'CLIENT_ID',
	'TOKEN',
	'DATABASE_URI',
	'SEED_SECRET',
	'MAX_ROWS',
	'MAX_COLS',
	'DEFAULT_BOMBS',
	'ACTIVE_TAG_NAME',
	'WIN_TAG_NAME',
	'LOSE_TAG_NAME',
];

export const SAFE_TILE = {
	x: 0,
	y: 0,
};

// prettier-ignore
export const EMOJIS_MEANING = {
	[`${EMOJIS.BOMB} ${EMOJIS.BOOM}`]: 'bomba (zależnie od stanu gry)',
	[`${EMOJIS.FLAG}`]: 'pole oflagowane jako bomba',
	[`${EMOJIS.BLUE_SQUARE}`]: 'obramowanie planszy',
	[`${EMOJIS.WHITE_SQUARE}`]: 'puste odkryte pole',
	[`${EMOJIS.BLACK_SQUARE}`]: 'nieodkryte pole',
	[`${EMOJIS.YELLOW_SQUARE}`]: 'pozycja gracza (na nieodkrytym polu)',
	[`${EMOJIS.RED_SQUARE}`]: 'pozycja gracza (na oflagowanym polu)',
	[`${EMOJIS.NUMBERS[1]}-${EMOJIS.NUMBERS[8]}`]: 'liczba bomb wokół pola',
	[`${EMOJIS.ARROWS.UP}${EMOJIS.ARROWS.DOWN}${EMOJIS.ARROWS.LEFT}${EMOJIS.ARROWS.RIGHT}`]: 'obramowanie, wskazują na aktualną pozycje',
	[`${EMOJIS.PURPLE_SQUARE}`]: 'linia pomocnicza (odkryte pole bez bomby)',
	[`${EMOJIS.GREEN_SQUARE}`]: 'linia pomocnicza (nieodkryte pole)',
};
