// Import external libraries
const axios = require('axios');
const { AxieGene } = require('agp-npm/dist/axie-gene');
const { MessageAttachment, MessageEmbed } = require('discord.js');

// Import internal libraries
const { delete_element, get_axie_brief_list_query, get_axie_detail_query, set_egg_attributes, set_adult_attributes, create_failed_message } = require('./helpers.js')

async function search_axie(query, channel) {
  await axios.post(`https://axieinfinity.com/graphql-server-v2/graphql`,
    {
      operationName: "GetAxieBriefList",
      query: get_axie_brief_list_query(),

      variables: {
        auctionType: "Sale",
        criteria: {
          classes: query.class,
          parts: query.body_parts,
          hp: query.hp,
          speed: query.speed,
          skill: query.skill,
          morale: query.morale,
          breedCount: query.breed_count,
          pureness: query.pureness,
          numMystic: query.mystic,
          title: null,
          region: null,
          stages: query.stage
        },
        from: 0,
        size: 1,
        sort: "PriceAsc",
        owner: null
      }
    }
  ).then((response) => {
    if(response.data.data.axies.total  <= 0){
      console.log('No Axie was found in scheduled search.')
      return false
      // try {
      //   channel.send({ embeds: [create_failed_message()] })
      // }
      // catch(error) {
      //   console.log('Failed to send reminder to channel.')
      // }
      // finally {
      //   return false
      // }

    }
    else {
      const checker = async () => {
        if(await find_axie_details(response, query, channel)){
          console.log('An Axie was found in scheduled search. Reminder record is about to be deleted.')
          if(delete_element(scheduled_search, query)) {
            console.log('Reminder record deletion is successful.')
          }
          else {
            console.log('Reminder record is not found.')
          }
        }
        else {
          console.log('No Axie was found in scheduled search.')
        }
      }
      checker()
    }
  }).catch(error => {
    console.log('An error occured while attempting search.')
  });
}

async function find_axie_details(data, query, channel) {
  temp = data.data.data.axies.results

  character = {
    price: null,
    eth: null,
    id: temp[0].id,
    url: temp[0].image,
    name: temp[0].name,
    pureness: String(temp[0].pureness),
    mystic: String(temp[0].numMystic),
    breed_count: String(temp[0].breedCount),
    stage: temp[0].stage,
    class: temp[0].class,
    hp: null,
    speed: null,
    skill: null,
    morale: null,
    eyes: null,
    ears: null,
    horn: null,
    mouth: null,
    back: null,
    tail: null
  }

  if(await axios.post(`https://axieinfinity.com/graphql-server-v2/graphql`,
    {
      operationName: "GetAxieDetail",
      variables: {
        axieId: character.id
      },
      query: get_axie_detail_query()
    }
  ).then((response) => {
    temp = response.data.data.axie

    character.price = temp.auction.currentPriceUSD
    character.eth = temp.auction.currentPrice

    if(query.price >= character.price) {
      if(character.stage == 1) {
        try {
          channel.send({ embeds: [set_egg_attributes(character)] })
        }
        catch(error) {
          console.log('Failed to send reminder to channel.')
        }
        finally {
          return true
        }
      }
      else {
        character.genes = temp.genes
        character.hp = String(temp.stats.hp)
        character.speed = String(temp.stats.speed)
        character.skill = String(temp.stats.skill)
        character.morale = String(temp.stats.morale)

        const axie_gene = new AxieGene(character.genes)
        genes_readable = axie_gene._genes

        character.eyes = genes_readable.eyes
        character.ears = genes_readable.ears
        character.horn = genes_readable.horn
        character.mouth = genes_readable.mouth
        character.back = genes_readable.back
        character.tail = genes_readable.tail

        try {
          channel.send({ embeds: [set_adult_attributes(character)] })
        }
        catch(error) {
          console.log('Failed to send reminder to channel.')
        }
        finally {
          return true
        }
      }
    }
    else {
      return false

      // try {
      //   channel.send({ embeds: [create_failed_message()] })
      // }
      // catch(error) {
      //   console.log('Failed to send reminder to channel.')
      // }
      // finally {
      //   return false
      // }
    }
  }).catch(error => {
    console.log('An error occured while attempting search.')
    return false
  }))
  return true
  else {
    return false
  }
}

module.exports = { search_axie }
