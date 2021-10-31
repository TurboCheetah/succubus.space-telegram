import type { Env, EnvAny, EnvBoolean, EnvInteger, EnvString } from './types/env'

export const envParseInteger = (key: EnvInteger): number => {
  const value = process.env[key]
  const integer = Number(value)

  if (Number.isInteger(integer)) return integer
  throw new Error(`[ENV] ${key} - The key must be an integer, but received '${value}'.`)
}

export const envParseBoolean = (key: EnvBoolean): boolean => {
  const value = process.env[key]

  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`[ENV] ${key} - The key must be a boolean, but received '${value}'.`)
}

export function envParseString<K extends EnvString>(key: K): Env[K] {
  const value = process.env[key]

  return value as Env[K]
}

export const envParseArray = (key: EnvString): string[] => {
  const value = process.env[key]

  return (value as string).split(' ')
}

export const envIsDefined = (...keys: readonly EnvAny[]): boolean => {
  return keys.every(key => {
    const value = process.env[key]
    return value !== undefined && value.length !== 0
  })
}
