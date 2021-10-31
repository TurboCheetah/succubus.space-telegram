import { Telegraf } from 'telegraf'
import { Logger } from './structures/Logger'
import Middlewares, { CommandContext } from './middlewares'
import Commands from './commands'
import config from './config'

// Initialize stuff
const logger = new Logger()
const bot = new Telegraf<CommandContext>(config.token)

bot.use(Middlewares, Commands)

// Error handling
bot.catch((err, ctx) => logger.error(`Ooops, encountered an error for ${ctx.updateType}\n ${err}`))

// Start bot
bot.launch().then(() => logger.success('Bot started'))

// Handle exits
process.once('SIGINT', () => {
  logger.warn('Stopping bot')
  bot.stop('SIGINT')
})

process.once('SIGTERM', () => {
  logger.warn('Stopping bot')
  bot.stop('SIGTERM')
})
