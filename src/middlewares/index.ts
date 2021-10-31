import { Composer } from 'telegraf'

import args, { CommandContext } from './args'

export default new Composer<CommandContext>().use(args)

export { CommandContext }
