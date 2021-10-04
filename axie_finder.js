// Import external libraries
const axios = require('axios');
const { AxieGene } = require('agp-npm/dist/axie-gene');
const { MessageEmbed } = require('discord.js');

// Import internal libraries
const { get_axie_brief_list_query, get_axie_detail_query, set_egg_attributes, set_adult_attributes, compute_purity, create_failed_message } = require('./helpers.js')

async function search_axie(query, interaction) {
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
        size: search_size,
        sort: "PriceAsc",
        owner: null
      }
    }
  ).then((response) => {
    if(response.data.data.axies.total  <= 0){
      try {
        interaction.editReply({ embeds: [create_failed_message()] })
      }
      catch(error) {
        console.log('Failed to send message.')
      }
      finally {
        scheduled_search.push(query)
        console.log('Reminder has been scheduled.')
      }
    }
    else {
      find_axie_details(response, query, interaction)
      scheduled_search.push(query)
      console.log('Reminder has been scheduled.')
    }
  }).catch(error => {
    console.log('An error occured while attempting search.')
  });
}

async function find_axie_details(data, query, interaction) {
  temp = data.data.data.axies.results
  flag = false

  for(const temp_character of temp) {
    // console.log('Checking Axie #' + temp_character.id + '...')
    if(await axios.post(`https://axieinfinity.com/graphql-server-v2/graphql`,
      {
        operationName: "GetAxieDetail",
        variables: {
          axieId: temp_character.id
        },
        query: get_axie_detail_query()
      }
    ).then((response) => {
      temp = response.data.data.axie

      if(query.price >= temp.auction.currentPriceUSD) {
        if(temp_character.stage == 1) {
          // console.log('Match found!')
          character = {
            price: temp.auction.currentPriceUSD,
            eth: temp.auction.currentPrice,
            id: temp_character.id,
            url: temp_character.image,
            name: temp_character.name,
            pureness: String(temp_character.pureness),
            mystic: String(temp_character.numMystic),
            breed_count: String(temp_character.breedCount),
            stage: temp_character.stage,
            class: temp_character.class,
          }
          try {
            interaction.editReply({ embeds: [set_egg_attributes(character)] })
          }
          catch(error) {
            console.log('Failed to send message.')
          }
          finally {
            return true
          }
        }
        else {
          genes = temp.genes

          const axie_gene = new AxieGene(genes)
          genes_readable = axie_gene._genes

          eyes = genes_readable.eyes
          ears = genes_readable.ears
          horn = genes_readable.horn
          mouth = genes_readable.mouth
          back = genes_readable.back
          tail = genes_readable.tail

          if(compute_purity({eyes: eyes, ears: ears, horn: horn, mouth: mouth, back: back, tail: tail}, temp_character.class) >= query.purity) {
            // console.log('Match found!')
            character = {
              price: temp.auction.currentPriceUSD,
              eth: temp.auction.currentPrice,
              id: temp_character.id,
              url: temp_character.image,
              name: temp_character.name,
              pureness: String(temp_character.pureness),
              mystic: String(temp_character.numMystic),
              breed_count: String(temp_character.breedCount),
              stage: temp_character.stage,
              class: temp_character.class,
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

            character.hp = String(temp.stats.hp)
            character.speed = String(temp.stats.speed)
            character.skill = String(temp.stats.skill)
            character.morale = String(temp.stats.morale)

            character.eyes = eyes
            character.ears = ears
            character.horn = horn
            character.mouth = mouth
            character.back = back
            character.tail = tail

            try {
              interaction.editReply({ embeds: [set_adult_attributes(character)] })
            }
            catch(error) {
              console.log('Failed to send message.')
            }
            finally {
              return true
            }
          }
        }
      }
      else {

      }
    }).catch(error => {
      console.log('An error occured while attempting search.')
      flag = false
    }))
    {
      return true
    }
    else {
      flag = false
    }
  }

  try {
    if(!flag) {
      // scheduled_search.push(query)
      // console.log('Reminder has been scheduled.')
      interaction.editReply({ embeds: [create_failed_message()] })
    }
  }
  catch(error) {
    console.log('Failed to send message.')
  }
  finally {
    return flag
  }
}

module.exports = { search_axie }
