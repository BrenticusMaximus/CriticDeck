import { Navigation } from '@decky/ui'
import React, { useMemo } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { useGameOverview } from '../../hooks/useGameOverview'
import { useMetacriticScore } from '../../hooks/useMetacriticScore'
import { useSettings, DateFormat } from '../../hooks/useSettings'
import { criticDeckStyle } from './style'

const toneForScore = (score?: number | null) => {
  if (typeof score !== 'number') return 'unknown'
  if (score >= 75) return 'great'
  if (score >= 60) return 'good'
  return 'weak'
}

const toneForUserScore = (score?: number | null) => {
  if (typeof score !== 'number') return 'unknown'
  if (score >= 8) return 'great'
  if (score >= 6.5) return 'good'
  return 'weak'
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const pad = (value: number, size: number) =>
  value.toString().padStart(size, '0')

const formatReleaseDate = (value?: string | null, format?: DateFormat) => {
  if (!value || !format) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  const monthName = monthNames[monthIndex]
  const day = date.getDate()
  const mm = pad(monthIndex + 1, 2)
  const dd = pad(day, 2)

  switch (format) {
    case 'MDY':
      return `${monthName} ${day}, ${year}`
    case 'DMY':
      return `${day} ${monthName} ${year}`
    case 'YMD':
      return `${year} ${monthName} ${day}`
    case 'JUL': {
      const startOfYear = new Date(Date.UTC(year, 0, 0))
      const diff =
        (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      const dayOfYear = Math.floor(diff)
      return `${pad(year % 100, 2)}/${pad(dayOfYear, 3)}`
    }
    case 'USA':
      return `${mm}/${dd}/${year}`
    case 'EUR':
      return `${dd}.${mm}.${year}`
    case 'ISO':
    case 'JIS':
    default:
      return `${year}-${mm}-${dd}`
  }
}

export const MetacriticBadge = () => {
  const overview = useGameOverview()
  const title = overview?.display_name
  const { data, loading, error } = useMetacriticScore(title)
  const { settings } = useSettings()
  const cardSize = 'card'
  const { position, horizontalOffset, verticalOffset } = settings

  const tone = useMemo(() => toneForScore(data?.score), [data?.score])
  const label = data?.sentiment || (data?.found === false ? 'No score yet' : 'Metascore')
  const formattedDate = useMemo(
    () => formatReleaseDate(data?.release_date, settings.dateFormat),
    [data?.release_date, settings.dateFormat]
  )
  const userScoreValue = data?.user_score
  const userTone = useMemo(
    () => toneForUserScore(userScoreValue),
    [userScoreValue]
  )
  const metascoreDisplay = useMemo(() => {
    if (typeof data?.score === 'number') {
      return data.score
    }
    if (data?.found) {
      return 'TBD'
    }
    return '--'
  }, [data?.score, data?.found])

  if (!title) {
    return <></>
  }

  const showMetascore =
    settings.scoreDisplay === 'metascore' || settings.scoreDisplay === 'both'
  const showUserScore =
    (settings.scoreDisplay === 'userscore' || settings.scoreDisplay === 'both') &&
    typeof userScoreValue === 'number'
  const showBothScores = showMetascore && showUserScore

  const renderBreakdown = (breakdown?: {
    positive?: number
    mixed?: number
    negative?: number
  }) => {
    if (!breakdown) return null
    const values = [
      { key: 'positive', value: breakdown.positive ?? 0, tone: 'great' },
      { key: 'mixed', value: breakdown.mixed ?? 0, tone: 'good' },
      { key: 'negative', value: breakdown.negative ?? 0, tone: 'weak' }
    ]
    const total = values.reduce((sum, item) => sum + item.value, 0)
    if (!total) return null
    return (
      <div className="criticdeck-bar">
        {values.map(({ key, value, tone }) => {
          const width = `${Math.round((value / total) * 100)}%`
          return (
            <span
              key={key}
              data-tone={tone}
              style={{ width }}
              title={`${key}: ${value}`}
            />
          )
        })}
      </div>
    )
  }

  const renderActions = () => (
    <div className="criticdeck-actions">
      <button
        type="button"
        onClick={() => {
          if (data?.metacritic_url) {
            Navigation.NavigateToExternalWeb(data.metacritic_url)
          }
        }}
        disabled={!data?.metacritic_url}
      >
        <FaExternalLinkAlt style={{ marginRight: 4 }} /> View Details
      </button>
    </div>
  )

  const renderCardLayout = () => (
    <div className="criticdeck-card" data-size={cardSize}>
      <div className="criticdeck-scores" data-compact={showBothScores}>
        {showMetascore && (
          <div
            className="criticdeck-score-square"
            data-tone={tone}
            data-compact={showBothScores}
          >
            <strong>{metascoreDisplay}</strong>
            <span className="criticdeck-score-label">
              <span>META</span>
              <span>SCORE</span>
            </span>
          </div>
        )}
        {showUserScore && (
          <>
            <div
              className="criticdeck-score-circle"
              data-tone={userTone}
              data-compact={showBothScores}
            >
              <strong>{userScoreValue.toFixed(1)}</strong>
              <span>User Score</span>
            </div>
          </>
        )}
      </div>
      <div className="criticdeck-body">
        <div className="criticdeck-title">{data?.title ?? title}</div>
        <div className="criticdeck-meta">
          {data?.platform || 'Platform unknown'}
          {formattedDate ? ` · ${formattedDate}` : ''}
        </div>
        <div className="criticdeck-status">
          {loading && 'Updating Metacritic score…'}
          {!loading && error && `⚠️ ${error}`}
          {!loading && !error && label}
        </div>
        {renderActions()}
      </div>
    </div>
  )

  return (
    <div
      id="criticdeck-badge-container"
      className="criticdeck-badge-root"
      data-position={position}
      style={
        {
          '--criticdeck-offset-x': `${horizontalOffset || 0}px`,
          '--criticdeck-offset-y': `${verticalOffset || 0}px`
        } as React.CSSProperties
      }
    >
      {criticDeckStyle}
      {renderCardLayout()}
    </div>
  )
}
