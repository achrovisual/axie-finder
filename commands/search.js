const { SlashCommandBuilder } = require('@discordjs/builders');
const axie_finder = require('../axie_finder.js')

module.exports = {
	data: new SlashCommandBuilder()
	.setName('search')
	.setDescription('Search for an Axie based on your given criteria.')
	.addIntegerOption(option =>
		option
		.setName('price')
		.setDescription('Maximum price for the Axie beign searched for.')
		.setRequired(true))
	.addStringOption(option =>
		option
		.setName('class')
		.setDescription('The class of the Axie you are looking for.')
		.addChoice('beast', 'Beast')
		.addChoice('aquatic', 'Aquatic')
		.addChoice('plant', 'Plant')
		.addChoice('bird', 'Bird')
		.addChoice('bug', 'Bug')
		.addChoice('reptile', 'Reptile')
		.addChoice('mech', 'Mech')
		.addChoice('dawn', 'Dawn')
		.addChoice('dusk', 'Dawn'))
	.addIntegerOption(option =>
		option
		.setName('stage')
		.setDescription('The stage of the Axie should be in.')
		.addChoice('egg', 1)
		.addChoice('adult', 4))
	.addIntegerOption(option =>
		option
		.setName('breed_count')
		.setDescription('The breed count is how many times the Axie has already produced offspring.'))
	.addIntegerOption(option =>
		option
		.setName('mystic')
		.setDescription('The number of mystic parts that the Axie has.'))
	.addIntegerOption(option =>
		option
		.setName('pureness')
		.setDescription('Pureness is the number of traits that matches the class of the Axie.'))
	.addIntegerOption(option =>
		option
		.setName('purity')
		.setDescription('Purity is an Axie\'s actual pureness in percentage.'))
	.addStringOption(option =>
		option
		.setName('body_part')
		.setDescription('The body part along with the body part name.'))
	.addIntegerOption(option =>
		option
		.setName('hp')
		.setDescription('Determines the total Hit points of an Axie.'))
	.addIntegerOption(option =>
		option
		.setName('speed')
		.setDescription('Speed determines the attack order of Axies.'))
	.addIntegerOption(option =>
		option
		.setName('skill')
		.setDescription('Skill determines an Axie\'s accuracy.'))
	.addIntegerOption(option =>
		option
		.setName('morale')
		.setDescription('Morale determines an Axie\'s critical strike chance and number of “last stand” turns.')),
	async execute(interaction) {
		await interaction.deferReply();
		query = {
			guild_id: interaction.guildId,
			channel_id: interaction.channelId,
			user_id: interaction.user.id,
			body_parts: interaction.options.getString('body_part') == null ? null : interaction.options.getString('body_part').split(' '),
			class: interaction.options.getString('class') == null ? null : interaction.options.getString('class').split(' '),
			stage: interaction.options.getInteger('stage') == null ? null : interaction.options.getInteger('stage'),
			hp: interaction.options.getInteger('hp') == null ? null : [interaction.options.getInteger('hp')],
			skill: interaction.options.getInteger('skill') == null ? null : [interaction.options.getInteger('skill')],
			morale: interaction.options.getInteger('morale') == null ? null : [interaction.options.getInteger('morale')],
			speed: interaction.options.getInteger('speed') == null ? null : [interaction.options.getInteger('speed')],
			breed_count: interaction.options.getInteger('breed_count') == null ? null : interaction.options.getInteger('breed_count'),
			pureness: interaction.options.getInteger('pureness') == null ? [6] : [interaction.options.getInteger('pureness')],
			purity: interaction.options.getInteger('purity') == null ? 50 : interaction.options.getInteger('purity'),
			mystic: interaction.options.getInteger('mystic') == null ? null : [interaction.options.getInteger('mystic')],
			price: interaction.options.getInteger('price') == null ? null : interaction.options.getInteger('price')
		}
		axie_finder.search_axie(query, interaction)
	}
}
