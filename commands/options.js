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
		.setDescription('Interval of when the reminders will be sent. Input an interval in minutes.')
		.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		if (interaction.options.getInteger('interval') >= 1) {
			try {
				reminder_interval = interaction.options.getInteger('interval')
				clearTimeout(timeout)
				console.log('Reminder interval has been changed.')
				interaction.editReply({ embeds: [create_generic_message('Reminder interval has been set to ' + reminder_interval + (reminder_interval > 1 ? ' minutes.' : ' minute.'))] })
			}
			catch(error) {
				console.log('An error occured while sending a reply.')
			}
		}
		else {
			try {
				interaction.editReply({ embeds: [create_generic_error('Interval cannot be less than 1 minute. Try again.')] })
			}
			catch(error) {
				console.log('An error occured while sending a reply.')
			}
		}
	}
}
