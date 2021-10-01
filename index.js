// Import external libraries
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

// Import internal libraries
const scheduler = require('./message_scheduler.js')

// Declare Discord client
global.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

// Declare variables
global.scheduled_search = []
global.target_channel = null

const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Register commands to client
for (const file of command_files) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// When client is ready, start checking for cached search queries
client.once('ready', () => {

	// Declare asynchronous function that will check for cached search queries
	const check_for_queries = async () => {

		// Iterate through search queries and attempt to perform search
		for (const message of scheduled_search) {

			// Create guild from client
			try {
				const guild = await client.guilds.fetch(message.guild_id)
				if (!guild) {
					continue
				}

				// Create channel from client
				const channel = await guild.channels.cache.get(message.channel_id)
				if (!channel) {
					continue
				}

				// Start search
				await scheduler.search_axie(message, channel)
			}
			catch (error) {
				console.log('Failed to find channel.')
				try {
					const channel = await client.users.fetch(message.user_id)

					// Start search
					await scheduler.search_axie(message, channel)
				}
				catch (error) {
					console.log('Failed to find user.')
				}
			}
			finally {
				console.log('Scheduled search has been attempted.')
			}
		}

		// Pause for 6 hours
		setTimeout(check_for_queries, 1000 * 10)
	}

	// Start checking for queries
	check_for_queries()
});

// When an interaction has been created, execute command
client.on('interactionCreate', async interaction => {

	// Check if command is a slash command
	if (!interaction.isCommand()) return;

	// Create command from client
	const command = client.commands.get(interaction.commandName);

	// Check if command is a registered command
	if (!command) return;

	// Attempt to execute command
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login via token
client.login(process.env.DISCORD_TOKEN);
