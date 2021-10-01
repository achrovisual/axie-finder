const { SlashCommandBuilder } = require('@discordjs/builders');
const axie_finder = require('../axie_finder.js')

// Import internal libraries
const { create_generic_message } = require('../helpers.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('clear')
	.setDescription('Clear all reminders.'),
	async execute(interaction) {
		scheduled_search = []
		await interaction.deferReply();
		try {
			interaction.editReply({ embeds: [create_generic_message('Reminders have been cleared.')] })
		}
		catch(error) {
			console.log('An error occured while sending a reply.')
		}
	}
}
