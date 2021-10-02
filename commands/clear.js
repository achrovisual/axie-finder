const { SlashCommandBuilder } = require('@discordjs/builders');
const axie_finder = require('../axie_finder.js')

// Import internal libraries
const { create_generic_message, create_generic_error } = require('../helpers.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('clear')
	.setDescription('Clear all reminders.'),
	async execute(interaction) {
		await interaction.deferReply();
		if(interaction.channelId != null) {
			temp_length = scheduled_search.length
			scheduled_search = scheduled_search.filter(item => item.channel_id !== interaction.channelId)
			if(scheduled_search.length < temp_length) {
				console.log('Reminders for channel ' + interaction.channelId + ' have been cleared.')
				try {
					interaction.editReply({ embeds: [create_generic_message('Reminders have been cleared.')] })
				}
				catch(error) {
					console.log('An error occured while sending a reply.')
				}
			}
			else {
				try {
					console.log('No reminders were found for channel ' + interaction.channelId + '.')
					interaction.editReply({ embeds: [create_generic_error('There are no pending reminders.')] })
				}
				catch(error) {
					console.log('An error occured while sending a reply.')
				}
			}
		}
	}
}
