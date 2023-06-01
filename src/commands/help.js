import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { EMOJIS } from '../game/emojis.js';

export const command = {
	data: new SlashCommandBuilder().setName('help').setDescription('Provides a description of game tiles in Minesweeper'),
	async execute(interaction) {
		const embed = {
			content: 'Wyjaśnienie gry',
			embeds: [
				new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle(`Znaczenie pól na planszy`)
					.setDescription(
						`${EMOJIS.BOMB} ${EMOJIS.BOOM} - bomba (zależnie od stanu gry)
                    ${EMOJIS.FLAG} - pole oflagowane jako bomba
                    ${EMOJIS.BLUE_SQUARE} - obramowanie planszy
                    ${EMOJIS.WHITE_SQUARE} - puste odkryte pole
                    ${EMOJIS.BLACK_SQUARE} - nieodkryte pole
                    ${EMOJIS.YELLOW_SQUARE} - pozycja gracza (na nieodkrytym polu)
                    ${EMOJIS.ORANGE_SQUARE} - pozycja gracza (na odkrytym polu)
                    ${EMOJIS.RED_SQUARE} - pozycja gracza (na oflagowanym polu)
                    ${EMOJIS.NUMBERS[1]}-${EMOJIS.NUMBERS[8]} - liczba bomb wokół aktualnego pola
                    ${EMOJIS.ARROWS.UP}${EMOJIS.ARROWS.DOWN}${EMOJIS.ARROWS.LEFT}${EMOJIS.ARROWS.RIGHT} - obramowanie, wskazują na aktualną pozycje
                    `
					)
					.setTimestamp(),
			],
			ephemeral: true,
		};

		return interaction.reply(embed);
	},
};
