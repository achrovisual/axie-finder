const { SlashCommandBuilder } = require('@discordjs/builders');
const axie_finder = require('../axie_finder.js')

// Import internal libraries
const { create_generic_message } = require('../helpers.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('clear')
	.setDescription('Search for an Axie based on your given criteria.'),
	async execute(interaction) {
		scheduled_search = []
		await interaction.deferReply();
		interaction.editReply({ embeds: [create_generic_message('Reminders have been cleared')] })
	}
}
