import { useMemo } from 'react'

import { en, TranslationKey } from './en'
import { ptBR } from './pt-BR'
import { useSettings } from '../hooks/useSettings'

export type { TranslationKey } from './en'

export const LANGUAGE_OPTIONS = [
  { value: 'auto', label: 'settings.languageAuto' as TranslationKey },
  { value: 'en', label: 'settings.languageEnglish' as TranslationKey },
  { value: 'pt-BR', label: 'settings.languagePortuguese' as TranslationKey }
] as const

export type Language = 'en' | 'pt-BR'
export type LanguagePreference = (typeof LANGUAGE_OPTIONS)[number]['value']

const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = {
  en,
  'pt-BR': ptBR
}

const detectSystemLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en'
  const systemLanguage = (navigator.language || 'en').toLowerCase()
  return systemLanguage.startsWith('pt') ? 'pt-BR' : 'en'
}

const resolveLanguage = (preference: LanguagePreference): Language =>
  preference === 'auto' ? detectSystemLanguage() : preference

export const translate = (
  language: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string => {
  const template = DICTIONARIES[language][key] ?? en[key] ?? key
  if (!vars) return template
  return Object.entries(vars).reduce(
    (acc, [name, value]) => acc.split(`{${name}}`).join(String(value)),
    template
  )
}

// Metacritic's API returns sentiment as free English text drawn from a
// fixed, known vocabulary - map it to a translation key so it can be
// localized, falling back to the original text for any value outside that
// known set instead of silently dropping it.
const SENTIMENT_KEYS: Record<string, TranslationKey> = {
  'universal acclaim': 'metacritic.sentiment.universalAcclaim',
  'generally favorable': 'metacritic.sentiment.generallyFavorable',
  'mixed or average': 'metacritic.sentiment.mixedOrAverage',
  'mixed or average reviews': 'metacritic.sentiment.mixedOrAverageReviews',
  'generally unfavorable': 'metacritic.sentiment.generallyUnfavorable',
  'overwhelming dislike': 'metacritic.sentiment.overwhelmingDislike'
}

export const translateSentiment = (
  language: Language,
  sentiment: string | undefined
): string | undefined => {
  if (!sentiment) return sentiment
  const key = SENTIMENT_KEYS[sentiment.trim().toLowerCase()]
  return key ? translate(language, key) : sentiment
}

/**
 * React hook giving components a `t()` function that re-renders when the
 * resolved language changes - it piggybacks on useSettings()'s shared
 * store, so a language change made in the Settings panel is picked up by
 * every other mounted component immediately, the same way every other
 * setting already does.
 */
export const useTranslation = () => {
  const { settings } = useSettings()
  const language = resolveLanguage(settings.language)

  const t = useMemo(
    () => (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(language, key, vars),
    [language]
  )

  return { t, language }
}
