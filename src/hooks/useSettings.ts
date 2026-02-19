import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'criticdeck.settings'

export const DATE_FORMAT_OPTIONS = [
  { value: 'MDY', label: 'MDY (Month, day, year)' },
  { value: 'DMY', label: 'DMY (Day, month, year)' },
  { value: 'YMD', label: 'YMD (Year, month, day)' },
  { value: 'JUL', label: 'JUL (yy/ddd)' },
  { value: 'ISO', label: 'ISO (YYYY-MM-DD)' },
  { value: 'USA', label: 'USA (MM/DD/YYYY)' },
  { value: 'EUR', label: 'EUR (DD.MM.YYYY)' },
  { value: 'JIS', label: 'JIS (YYYY-MM-DD)' }
] as const

export type DateFormat = (typeof DATE_FORMAT_OPTIONS)[number]['value']

export const SCORE_DISPLAY_OPTIONS = [
  { value: 'metascore', label: 'Metascore only' },
  { value: 'userscore', label: 'User score only' },
  { value: 'both', label: 'Both scores' }
] as const

export type ScoreDisplay = (typeof SCORE_DISPLAY_OPTIONS)[number]['value']

export const LAYOUT_OPTIONS = [
  { value: 'card', label: 'Default card' }
] as const

export type LayoutMode = (typeof LAYOUT_OPTIONS)[number]['value']

export const POSITION_OPTIONS = [
  { value: 'top-right', label: 'Top right' },
  { value: 'top-left', label: 'Top left' },
  { value: 'top-center', label: 'Top center' }
] as const

export type PositionOption = (typeof POSITION_OPTIONS)[number]['value']

type Settings = {
  dateFormat: DateFormat
  scoreDisplay: ScoreDisplay
  layoutMode: LayoutMode
  position: PositionOption
  horizontalOffset: number
  verticalOffset: number
}

const defaultSettings: Settings = {
  dateFormat: 'MDY',
  scoreDisplay: 'both',
  layoutMode: 'card',
  position: 'top-right',
  horizontalOffset: 24,
  verticalOffset: 56
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

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    setSettings(readSettings())
  }, [])

  const setPartialSetting = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
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
