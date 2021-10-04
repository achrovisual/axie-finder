const { SlashCommandBuilder } = require('@discordjs/builders');
const axie_finder = require('../axie_finder.js')

// Import internal libraries
const { create_generic_message, create_generic_error } = require('../helpers.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('options')
	.setDescription('Set bot options.')
	.addIntegerOption(option =>
		option
		.setName('interval')
		.setDescription('Interval of when the reminders will be sent. Input an interval in seconds.'))
	.addIntegerOption(option =>
		option
		.setName('size')
		.setDescription('Size of the search result.')),
	async execute(interaction) {
		await interaction.deferReply();

		if(interaction.options.getInteger('interval') != null) {
			if(interaction.options.getInteger('interval') >= 1) {
				try {
					reminder_interval = interaction.options.getInteger('interval')
					// clearTimeout(timeout)
					console.log('Reminder interval has been changed.')
					interaction.editReply({ embeds: [create_generic_message('Reminder interval has been set to ' + reminder_interval + (reminder_interval > 1 ? ' second.' : ' second.'))] })
				}
				catch(error) {
					console.log('An error occured while sending a reply.')
				}
			}
			else {
				try {
					interaction.editReply({ embeds: [create_generic_error('Interval cannot be less than 1 second. Try again.')] })
				}
				catch(error) {
					console.log('An error occured while sending a reply.')
				}
			}
		}
		else if(interaction.options.getInteger('size') != null) {
			if(interaction.options.getInteger('size') >= 1) {
				try {
					search_size = interaction.options.getInteger('size')
					// clearTimeout(timeout)
					console.log('Search size has been changed.')
					interaction.editReply({ embeds: [create_generic_message('Search size has been set to ' + search_size + '.')] })
				}
				catch(error) {
					console.log('An error occured while sending a reply.')
				}
			}
			else {
				try {
					interaction.editReply({ embeds: [create_generic_error('Search size cannot be less than 1. Try again.')] })
				}
				catch(error) {
					console.log('An error occured while sending a reply.')
				}
			}
		}
		else {
			try {
				rreminder_interval = 15
				search_size = 128
				// clearTimeout(timeout)
				console.log('Options have been set to default.')
				interaction.editReply({ embeds: [create_generic_message('Options have been set to default.')] })
			}
			catch(error) {
				console.log('An error occured while sending a reply.')
			}

		}
	}
}
