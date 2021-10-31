import { Composer } from 'telegraf'
import { stripIndents } from 'common-tags'

const bot = new Composer()

// Help command
bot.help(ctx => {
  ctx.reply(
    stripIndents`/hentai <id | name> - perform a search for hentai
    /doujin <id | name> - perform a search for doujinshi`,
    { parse_mode: 'Markdown' }
  )
})

export default bot
