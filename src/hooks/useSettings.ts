import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'criticdeck.settings'

import type { LanguagePreference, TranslationKey } from '../i18n'

export const DATE_FORMAT_OPTIONS = [
  { value: 'MDY', labelKey: 'settings.dateFormat.MDY' as TranslationKey },
  { value: 'DMY', labelKey: 'settings.dateFormat.DMY' as TranslationKey },
  { value: 'YMD', labelKey: 'settings.dateFormat.YMD' as TranslationKey },
  { value: 'JUL', labelKey: 'settings.dateFormat.JUL' as TranslationKey },
  { value: 'ISO', labelKey: 'settings.dateFormat.ISO' as TranslationKey },
  { value: 'USA', labelKey: 'settings.dateFormat.USA' as TranslationKey },
  { value: 'EUR', labelKey: 'settings.dateFormat.EUR' as TranslationKey },
  { value: 'JIS', labelKey: 'settings.dateFormat.JIS' as TranslationKey }
] as const

export type DateFormat = (typeof DATE_FORMAT_OPTIONS)[number]['value']

export const SCORE_DISPLAY_OPTIONS = [
  { value: 'metascore', labelKey: 'settings.scoreDisplay.metascore' as TranslationKey },
  { value: 'userscore', labelKey: 'settings.scoreDisplay.userscore' as TranslationKey },
  { value: 'both', labelKey: 'settings.scoreDisplay.both' as TranslationKey }
] as const

export type ScoreDisplay = (typeof SCORE_DISPLAY_OPTIONS)[number]['value']

export const LAYOUT_OPTIONS = [
  { value: 'card', labelKey: 'settings.layout.card' as TranslationKey },
  { value: 'modern', labelKey: 'settings.layout.modern' as TranslationKey },
  { value: 'modern-compact', labelKey: 'settings.layout.modernCompact' as TranslationKey }
] as const

export type LayoutMode = (typeof LAYOUT_OPTIONS)[number]['value']

export const POSITION_OPTIONS = [
  { value: 'top-right', labelKey: 'settings.position.topRight' as TranslationKey },
  { value: 'top-left', labelKey: 'settings.position.topLeft' as TranslationKey },
  { value: 'top-center', labelKey: 'settings.position.topCenter' as TranslationKey },
  { value: 'bottom-right', labelKey: 'settings.position.bottomRight' as TranslationKey },
  { value: 'bottom-left', labelKey: 'settings.position.bottomLeft' as TranslationKey },
  { value: 'bottom-center', labelKey: 'settings.position.bottomCenter' as TranslationKey }
] as const

export type PositionOption = (typeof POSITION_OPTIONS)[number]['value']

type Settings = {
  dateFormat: DateFormat
  scoreDisplay: ScoreDisplay
  layoutMode: LayoutMode
  position: PositionOption
  horizontalOffset: number
  verticalOffset: number
  cacheDays: number
  language: LanguagePreference
}

const defaultSettings: Settings = {
  dateFormat: 'MDY',
  scoreDisplay: 'both',
  layoutMode: 'card',
  position: 'top-right',
  horizontalOffset: 24,
  verticalOffset: 56,
  cacheDays: 7,
  language: 'auto'
}

const readSettings = (): Settings => {
  if (typeof localStorage === 'undefined') {
    return defaultSettings
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultSettings
    }
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      ...defaultSettings,
      ...parsed
    }
  } catch (_error) {
    return defaultSettings
  }
}

// Every component calls useSettings() independently, so a change written by
// one instance (e.g. the Settings panel) needs to be pushed to every other
// already-mounted instance (e.g. the badge) instead of only taking effect
// the next time that instance happens to remount.
let sharedSettings: Settings = readSettings()
const listeners = new Set<(settings: Settings) => void>()

const publishSettings = (next: Settings) => {
  sharedSettings = next
  listeners.forEach((listener) => listener(next))
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(sharedSettings)

  useEffect(() => {
    setSettings(sharedSettings)
    listeners.add(setSettings)
    return () => {
      listeners.delete(setSettings)
    }
  }, [])

  const setPartialSetting = useCallback((partial: Partial<Settings>) => {
    const next = { ...sharedSettings, ...partial }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
    publishSettings(next)
  }, [])

  const availableFormats = useMemo(() => DATE_FORMAT_OPTIONS, [])
  const availableScoreDisplays = useMemo(() => SCORE_DISPLAY_OPTIONS, [])
  const availableLayouts = useMemo(() => LAYOUT_OPTIONS, [])
  const availablePositions = useMemo(() => POSITION_OPTIONS, [])

  return {
    settings,
    setSetting: setPartialSetting,
    availableFormats,
    availableScoreDisplays,
    availableLayouts,
    availablePositions
  }
}
