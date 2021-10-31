import { Composer } from 'telegraf'
import { CommandContext } from '../middlewares'

import start from './start'
import help from './help'
import hentai from './hentai'

const bot = new Composer<CommandContext>()

bot.use(start, help, hentai)

export default bot
