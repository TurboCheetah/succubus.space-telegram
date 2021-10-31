export type BooleanString = 'true' | 'false'
export type IntegerString = `${bigint}`

export interface Env {
  NODE_ENV: 'test' | 'development' | 'production'

  TOKEN: string
}

export type EnvAny = keyof Env
export type EnvString = { [K in EnvAny]: Env[K] extends BooleanString | IntegerString ? never : K }[EnvAny]
export type EnvBoolean = { [K in EnvAny]: Env[K] extends BooleanString ? K : never }[EnvAny]
export type EnvInteger = { [K in EnvAny]: Env[K] extends IntegerString ? K : never }[EnvAny]
