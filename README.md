# Discord.js Minesweeper Game

Welcome to the Discord.js Minesweeper Game! This bot allows you to play the classic Minesweeper game within your Discord server. With an interactive and user-friendly interface, you can enjoy the challenge of uncovering mines and clearing the grid.

## Commands

- /create [rows]? [cols]? [bombs]? [challenge]?: Start a new game with the specified options. You can optionally provide the number of rows, columns, bombs and challenge(user) for a custom game.
- /help: Display the meaning of tiles. Get information about the symbols and numbers used in the game.
- /leaderboard: Show the top 10 users on the server's Minesweeper leaderboard.
- /rank [user]?: Show the rank of the specified user on the server's Minesweeper leaderboard. If no user is specified, it will show the rank of the user who issued the command.

## .env File

The .env file is used to store sensitive configuration information for your Discord.js Minesweeper Game bot. It allows you to keep these details separate from your code and provides an easy way to manage environment-specific settings. Here's an explanation of the variables in the .env file:

- CLIENT_ID: This variable should be set to the Discord application's client ID. It uniquely identifies your Discord application.
- TOKEN: This variable should be set to the token of your Discord bot. The bot token is required for authentication and allows your bot to connect to Discord's API.
- DATABASE_URI: This variable should be set to the URI of your MongoDB database. It provides the connection information required for your bot to interact with the database.
- SEED_SECRET: This variable is a secret used with every seed to ensure that users won't be able to generate the same board locally. It adds an extra layer of randomness to the game. It is recommended not to change this value as it would result in different boards than those that were created with the old value.
- MAX_ROWS: This variable represents the maximum number of rows for the Minesweeper game. It determines the height of the game board.
- MAX_COLS: This variable represents the maximum number of columns for the Minesweeper game. It determines the width of the game board.
- DEFAULT_BOMBS: This variable represents the default number of bombs for the Minesweeper game. It determines the initial number of bombs placed on the game board.
- ACTIVE_TAG_NAME: This variable represents the Discord forum channel tag name for the game that is in the "ACTIVE" state. It is used to identify the thread where the active game is being played.
- WIN_TAG_NAME: This variable represents the Discord forum channel tag name for the game that is in the "WIN" state. It is used to identify the thread where the game has been won.
- LOSE_TAG_NAME: This variable represents the Discord forum channel tag name for the game that is in the "LOSE" state. It is used to identify the thread where the game has been lost.

Ensure that you replace the placeholders with the appropriate values for your specific application. The .env file should not be committed to version control to protect sensitive information. In the repository, you will find a .env.example file. This file serves as a template for the actual .env file and includes placeholders for the environment variables. You can copy the .env.example file, rename it to .env, and populate it with your actual values. Please note that the .env file should be located in the root directory of your project and should not be shared publicly or exposed to unauthorized individuals. Make sure to keep your .env file secure and do not share its contents with others.

## How to Run the Discord.js Minesweeper Game

1. Install Node.js and MongoDB on your machine if you haven't already.
2. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/hades343/discordjs-minesweeper
   ```

3. Open a terminal or command prompt and navigate to the project's root directory:

   ```bash
   cd discordjs-minesweeper
   ```

4. Create a new file named .env in the root directory of the project.
5. In the src/command/guild_channel_mapping.json file, add an entry with your guild's ID and the corresponding forum channel ID in the following format:

   ```json
   {
   	"guild id": "forum channel id"
   }
   ```

6. Install the necessary dependencies by running the following command:

   ```bash
   npm install
   ```

7. Once the installation is complete, start the game by running the following command:

   ```bash
   npm start
   ```

The bot will now be running and ready to respond to commands in your Discord server. Remember to invite the bot to your Discord server using the OAuth2 URL generated for your Discord application, and grant the necessary permissions to the bot. Enjoy playing the Discord.js Minesweeper Game with your friends on Discord!

## Contributing

If you would like to contribute to the Discord.js Minesweeper Game project, you are welcome to do so! Here are the guidelines for contributing:

- For code changes, bug fixes, or new features, please submit a pull request (PR) from your forked repository to the main project repository.
- Make sure your code follows the project's coding style and conventions. Write clear and concise commit messages and provide a detailed description in your pull request.
- If you have ideas, suggestions, or non-code-related contributions such as feature requests or bug reports, please feel free to open an issue on the GitHub repository.

Thank you for your interest in contributing to the Discord.js Minesweeper Game project! Your contributions are greatly appreciated.

## Language

This project was initially designed for Polish users, and therefore, most messages sent to the user are written in Polish. However, it is possible to change the language preference within the code.
