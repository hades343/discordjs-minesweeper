function generateHexColor() {
	const HEX = '0123456789ABCDEF';
	let number = 0;
	for (let i = 0; i < 6; i++) {
		const digit = HEX[Math.floor(Math.random() * 16)];
		number = (number << 4) | parseInt(digit, 16);
	}
	return number;
}

export { generateHexColor };
