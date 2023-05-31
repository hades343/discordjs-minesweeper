import crypto from 'crypto';

function generateSeed(seedLength = 16) {
	const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const randomBytes = crypto.randomBytes(seedLength);
	let seed = '';
	for (let i = 0; i < seedLength; i++) {
		const byte = randomBytes[i];
		const index = byte % CHARACTERS.length;
		seed += CHARACTERS.charAt(index);
	}
	return seed;
}

function getSeededRandomGenerator(seed) {
	let seededRandom = 0;
	for (let i = 0; i < seed.length; i++) {
		const charCode = seed.charCodeAt(i);
		seededRandom = (seededRandom * 62 + charCode - 48) % 2147483647;
	}
	return () => {
		seededRandom = (seededRandom * 16807) % 2147483647;
		return seededRandom / 2147483647;
	};
}

export { generateSeed, getSeededRandomGenerator };
