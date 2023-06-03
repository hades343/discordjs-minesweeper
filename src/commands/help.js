import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { EMOJIS } from '../constants.js';

export const command = {
	data: new SlashCommandBuilder().setName('help').setDescription('Wyświetla znaczenie wszystkich pól z planszy'),
	async execute(interaction) {
		const embed = {
			content: 'Wyjaśnienie gry',
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Znaczenie pól na planszy`)
					.setDescription(
						`${EMOJIS.BOMB} ${EMOJIS.BOOM} - bomba (zależnie od stanu gry)\n${EMOJIS.FLAG} - pole oflagowane jako bomba\n${EMOJIS.BLUE_SQUARE} - obramowanie planszy\n${EMOJIS.WHITE_SQUARE} - puste odkryte pole\n${EMOJIS.BLACK_SQUARE} - nieodkryte pole\n${EMOJIS.YELLOW_SQUARE} - pozycja gracza (na nieodkrytym polu)\n${EMOJIS.ORANGE_SQUARE} - pozycja gracza (na odkrytym polu)\n${EMOJIS.RED_SQUARE} - pozycja gracza (na oflagowanym polu)\n${EMOJIS.NUMBERS[1]}-${EMOJIS.NUMBERS[8]} - liczba bomb wokół aktualnego pola\n${EMOJIS.ARROWS.UP}${EMOJIS.ARROWS.DOWN}${EMOJIS.ARROWS.LEFT}${EMOJIS.ARROWS.RIGHT} - obramowanie, wskazują na aktualną pozycje\n${EMOJIS.PURPLE_SQUARE} - linia pomocnicza (odkryte pole bez bomby)\n${EMOJIS.GREEN_SQUARE} - linia pomocnicza (nieodkryte pole)`
					)
					.setTimestamp(),
			],
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
