import { Composer, Markup } from 'telegraf'
import { request, gql } from 'graphql-request'
import { stripIndents } from 'common-tags'
import { hentaiType } from '../types/hentai'

const bot = new Composer()

// Hentai command
let data: hentaiType
bot.command('hentai', async ctx => {
  if (!ctx.state.command.args) return ctx.reply('Please specify an ID or name!')

  let query
  let variables

  if (isNaN(ctx.state.command.args)) {
    query = gql`
      query hentai($name: String!) {
        hentai(name: $name) {
          id
          name
          description
          coverURL
          posterURL
          likes
          dislikes
          views
          isCensored
          brand
          releasedAt
          tags
          monthlyRank
          durationInMs
          url
          invalid
        }
      }
    `
    variables = { name: ctx.state.command.args }
  } else {
    query = gql`
      query hentai($id: Int!) {
        hentai(id: $id) {
          id
          name
          description
          coverURL
          posterURL
          likes
          views
          isCensored
          brand
          tags
          monthlyRank
          durationInMs
          url
          invalid
        }
      }
    `
    variables = { id: parseInt(ctx.state.command.args) }
  }
  const { hentai } = await request('https://api.succubus.space/graphql', query, variables)
  data = hentai

  // reply with text and posterURL
  if (hentai.invalid) {
    return ctx.reply('Hentai not found')
  } else {
    return ctx.replyWithPhoto(hentai.coverURL, {
      caption: stripIndents`*${hentai.name}*

      *• Monthly Rank:* ${hentai.monthlyRank.toLocaleString()}
      *• Likes:* ${hentai.likes.toLocaleString()}
      *• Views:* ${hentai.views.toLocaleString()}
      *• Censored:* ${hentai.isCensored ? 'Yes' : 'No'}
      *• Duration:* ${Math.round(hentai.durationInMs / 1000 / 60)} minutes
      *• Studio:* ${hentai.brand}
      [\u200b](${hentai.posterURL})`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([Markup.button.callback('Synopsis', 'synopsis'), Markup.button.callback('Tags', 'tags'), Markup.button.url('Succubus.Space', `https://succubus.space/hentai/${hentai.id}`), Markup.button.url('HAnime.tv', hentai.url)], { columns: 2 })
    })
  }
})

// main menu callback
bot.action('main', async ctx => {
  ctx.answerCbQuery()
  ctx.editMessageCaption(
    stripIndents`*${data.name}*
      
      *• Monthly Rank:* ${data.monthlyRank.toLocaleString()}
      *• Likes:* ${data.likes.toLocaleString()}
      *• Views:* ${data.views.toLocaleString()}
      *• Censored:* ${data.isCensored ? 'Yes' : 'No'}
      *• Duration:* ${Math.round(data.durationInMs / 1000 / 60)} minutes
      *• Studio:* ${data.brand}
      [\u200b](${data.posterURL})`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([Markup.button.callback('Synopsis', 'synopsis'), Markup.button.callback('Tags', 'tags'), Markup.button.url('Succubus.Space', `https://succubus.space/hentai/${data.id}`), Markup.button.url('HAnime.tv', data.url)], { columns: 2 })
    }
  )
})

// synopsis callback
bot.action('synopsis', async ctx => {
  ctx.answerCbQuery()
  ctx.editMessageCaption(`${data.description.length > 1024 ? data.description.slice(0, 1000).replace(/\.$/, `… [Read more](https://succubus.space/hentai/${data.id}`) : data.description}`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([Markup.button.callback('Main Menu', 'main'), Markup.button.callback('Tags', 'tags'), Markup.button.url('Succubus.Space', `https://succubus.space/hentai/${data.id}`), Markup.button.url('HAnime.tv', data.url)], { columns: 2 })
  })
})

// tags callback
bot.action('tags', async ctx => {
  ctx.answerCbQuery()
  ctx.editMessageCaption(`\`\`\`${data.tags.join(', ')}\`\`\``, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([Markup.button.callback('Main Menu', 'main'), Markup.button.callback('Synopsis', 'synopsis'), Markup.button.url('Succubus.Space', `https://succubus.space/hentai/${data.id}`), Markup.button.url('HAnime.tv', data.url)], { columns: 2 })
  })
})

export default bot
