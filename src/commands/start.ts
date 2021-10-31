import { stripIndents } from 'common-tags'
import { Composer } from 'telegraf'

const bot = new Composer()

// Start command
bot.start(ctx =>
  ctx.reply(
    stripIndents`/hentai <id | name> - perform a search for hentai
    /doujin <id | name> - perform a search for doujinshi`,
    { parse_mode: 'Markdown' }
  )
)

export default bot
