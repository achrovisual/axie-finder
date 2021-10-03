const { MessageEmbed } = require('discord.js');

function price_formatter(string) {
  var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return formatter.format(string)
}

function eth_price_formatter(eth) {
  return (eth/1000000000000000000).toFixed(2) + ' Ξ'
}

function string_comparer(text, other) {
  return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}

function delete_element(array, element) {
  index = array.indexOf(element)

  if(index > -1) {
    array.splice(index, 1)
    return true
  }
  else
    return false
}

function get_axie_brief_list_query() {
  return 'query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  numMystic\n  pureness\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n'
}

function get_axie_detail_query() {
  return 'query GetAxieDetail($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\n\nfragment AxieDetail on Axie {\n  id\n  image\n  class\n  chain\n  name\n  genes\n  owner\n  birthDate\n  bodyShape\n  class\n  sireId\n  sireClass\n  matronId\n  matronClass\n  stage\n  title\n  breedCount\n  level\n  figure {\n    atlas\n    model\n    image\n    __typename\n  }\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  ownerProfile {\n    name\n    __typename\n  }\n  battleInfo {\n    ...AxieBattleInfo\n    __typename\n  }\n  children {\n    id\n    name\n    class\n    image\n    title\n    stage\n    __typename\n  }\n  __typename\n}\n\nfragment AxieBattleInfo on AxieBattleInfo {\n  banned\n  banUntil\n  level\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n'
}

function set_egg_attributes(character) {
  const message = new MessageEmbed()
  .setTitle('ID ' + character.id + ' - ' + character.name)
  .setDescription(eth_price_formatter(character.eth) + ' | ' + price_formatter(character.price))
  .setURL('https://marketplace.axieinfinity.com/axie/' + character.id)
  .setColor('#0099ff')
  .setThumbnail(character.url)

  return message
}

function set_adult_attributes(character) {
  const message = new MessageEmbed()
  .setTitle('ID ' + character.id + ' - ' + character.name)
  .setDescription(eth_price_formatter(character.eth) + ' | ' + price_formatter(character.price))
  .setURL('https://marketplace.axieinfinity.com/axie/' + character.id)
  .setColor('#0099ff')
  .setThumbnail(character.url)
  .addFields(
    { name: 'Class', value: character.class, inline: true},
    { name: 'Stage', value: character.stage == 1 ? 'Egg' : 'Adult', inline: true},
    { name: 'Breed Count', value: character.breed_count, inline: true},
    // { name: 'Pureness', value: character.pureness, inline: true},
    { name: 'Pureness', value: character.pureness + ' | ' + compute_purity({eyes: character.eyes, ears: character.ears, horn: character.horn, mouth: character.mouth, back: character.back, tail: character.tail}, character.class) + "%", inline: true},
    { name: 'Mystic', value: character.mystic, inline: true},
    { name: 'HP', value: character.hp, inline: true},
    { name: 'Speed', value: character.speed, inline: true},
    { name: 'Skill', value: character.skill, inline: true},
    { name: 'Morale', value: character.morale, inline: true},
    { name: 'Dominant', value: character.eyes.d.name + '\n' + character.ears.d.name + '\n' + character.horn.d.name + '\n' + character.mouth.d.name + '\n' + character.back.d.name + '\n' + character.tail.d.name, inline: true},
    { name: 'Recessive 1', value: character.eyes.r1.name + '\n' + character.ears.r1.name + '\n' + character.horn.r1.name + '\n' + character.mouth.r1.name + '\n' + character.back.r1.name + '\n' + character.tail.r1.name, inline: true},
    { name: 'Recessive 2', value: character.eyes.r2.name + '\n' + character.ears.r2.name + '\n' + character.horn.r2.name + '\n' + character.mouth.r2.name + '\n' + character.back.r2.name + '\n' + character.tail.r2.name, inline: true}
  )

  return message
}

function compute_purity(traits, cls) {
  const PROBABILITIES = {d: 0.375, r1: 0.09375, r2: 0.03125};
  const parts = ["eyes", "ears" ,"horn", "mouth", "back", "tail"];
  const MAX_QUALITY = 6 * (PROBABILITIES.d + PROBABILITIES.r1 + PROBABILITIES.r2);

  let quality = 0;

  for (let i in parts) {
      if (string_comparer(traits[parts[i]].d.cls, cls)) {
          quality += PROBABILITIES.d;
      }
      if (string_comparer(traits[parts[i]].r1.cls, cls)) {
          quality += PROBABILITIES.r1;
      }
      if (string_comparer(traits[parts[i]].r2.cls, cls)) {
          quality += PROBABILITIES.r2;
      }
  }
  return Math.round(quality / MAX_QUALITY * 100)
}

function create_failed_message() {
  const message = new MessageEmbed()
  .setTitle('Search Failed')
  .setDescription('No Axie was found based on the given criteria. I\'ll check again later.')
  .setColor('#B33F40')

  return message
}

function create_generic_message(string) {
  const message = new MessageEmbed()
  .setDescription(string)
  .setColor('#48A14D')

  return message
}

function create_generic_error(string) {
  const message = new MessageEmbed()
  .setDescription(string)
  .setColor('#B33F40')

  return message
}


module.exports = { delete_element, get_axie_brief_list_query, get_axie_detail_query, set_egg_attributes, set_adult_attributes, compute_purity, create_failed_message, create_generic_message, create_generic_error }
