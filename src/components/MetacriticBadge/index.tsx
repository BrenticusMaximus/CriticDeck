import { Navigation, appDetailsClasses } from '@decky/ui'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { GameOverview } from '../../hooks/useGameOverview'
import { useMetacriticScore } from '../../hooks/useMetacriticScore'
import { useSettings, DateFormat } from '../../hooks/useSettings'
import { useTranslation, translateSentiment } from '../../i18n'
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

const MONTH_KEYS = [
  'month.january',
  'month.february',
  'month.march',
  'month.april',
  'month.may',
  'month.june',
  'month.july',
  'month.august',
  'month.september',
  'month.october',
  'month.november',
  'month.december'
] as const

const pad = (value: number, size: number) =>
  value.toString().padStart(size, '0')

const formatReleaseDate = (
  value: string | null | undefined,
  format: DateFormat | undefined,
  t: ReturnType<typeof useTranslation>['t']
) => {
  if (!value || !format) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  const monthName = t(MONTH_KEYS[monthIndex])
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

// The badge is positioned absolutely inside the whole (tall, scrollable)
// page container, not just the hero banner, so CSS `bottom` anchors to the
// bottom of the entire page instead of the banner. Measure the banner's
// actual rendered height and compute `top` from it instead.
const findHeaderElement = (root: HTMLDivElement | null): Element | null => {
  const siblings = root?.parentElement?.children
  if (!siblings) return null
  for (const sibling of siblings) {
    if (sibling.className.includes(appDetailsClasses.Header)) {
      return sibling
    }
  }
  return null
}

export const MetacriticBadge = ({ overview }: { overview?: GameOverview }) => {
  const title = overview?.display_name
  const { settings } = useSettings()
  const { t, language } = useTranslation()
  const { data, loading, error } = useMetacriticScore(title, settings.cacheDays, t)
  const cardSize = 'card'
  const { position, horizontalOffset, verticalOffset } = settings
  const rootRef = useRef<HTMLDivElement>(null)
  const metaChipRef = useRef<HTMLDivElement>(null)
  const userChipRef = useRef<HTMLDivElement>(null)
  const [bannerHeight, setBannerHeight] = useState<number | null>(null)
  const [badgeHeight, setBadgeHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const header = findHeaderElement(rootRef.current)
    if (header) {
      setBannerHeight(header.getBoundingClientRect().height)
    }
    if (rootRef.current) {
      setBadgeHeight(rootRef.current.getBoundingClientRect().height)
    }
  }, [loading, data, settings.scoreDisplay, settings.position])

  const tone = useMemo(() => toneForScore(data?.score), [data?.score])
  const label =
    translateSentiment(language, data?.sentiment) ||
    (data?.found === false ? t('badge.noScoreYet') : t('badge.metascoreFallback'))
  const formattedDate = useMemo(
    () => formatReleaseDate(data?.release_date, settings.dateFormat, t),
    [data?.release_date, settings.dateFormat, t]
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
      return t('badge.tbd')
    }
    return '--'
  }, [data?.score, data?.found, t])
  // "Modern" shows the full, translated API-style phrasing ("based on N
  // ratings"/"based on N critic reviews"); "Modern Compact" shows just the
  // count ("N ratings"/"N reviews") on its own line below the score, to
  // keep the auto-sized chip tight. Both fall back to the score's own
  // denominator when the API has no review count for this title.
  const metascoreSub =
    typeof data?.critic_review_count === 'number'
      ? t('metacritic.ofCriticReviewsCount', { count: data.critic_review_count.toLocaleString() })
      : t('badge.outOfMax', { max: data?.score_max ?? 100 })
  const metascoreSubCompact =
    typeof data?.critic_review_count === 'number'
      ? t('metacritic.criticReviewsCountShort', { count: data.critic_review_count.toLocaleString() })
      : t('badge.outOfMax', { max: data?.score_max ?? 100 })
  // The user score API has no platform filter (see useMetacriticScore.ts),
  // so it always reflects the title's lead platform, which may not be the
  // platform resolved above. Disclose that mismatch instead of silently
  // presenting another platform's user score as if it were the resolved
  // one's.
  const userScorePlatformNote =
    data?.user_score_platform &&
    data.user_score_platform.toLowerCase() !== (data?.platform ?? '').toLowerCase()
      ? `(${data.user_score_platform})`
      : undefined
  const userScoreSub =
    typeof data?.user_review_count === 'number'
      ? t('metacritic.ofRatingsCount', { count: data.user_review_count.toLocaleString() })
      : t('badge.outOfTen')
  const userScoreSubCompact =
    typeof data?.user_review_count === 'number'
      ? t('metacritic.ratingsCountShort', { count: data.user_review_count.toLocaleString() })
      : t('badge.outOfTen')

  // The "modern" layout auto-sizes the critic/user score chips to their own
  // content (the review-count sub-text's length varies per game), so they
  // naturally end up different sizes. Measure both at their natural size and
  // force them to the larger of the two, so they always match without
  // hardcoding a fixed size. A no-op on the classic layout, whose chips
  // don't carry these refs.
  useLayoutEffect(() => {
    const metaEl = metaChipRef.current
    const userEl = userChipRef.current
    if (!metaEl || !userEl) return

    metaEl.style.minWidth = ''
    metaEl.style.minHeight = ''
    userEl.style.minWidth = ''
    userEl.style.minHeight = ''

    const metaRect = metaEl.getBoundingClientRect()
    const userRect = userEl.getBoundingClientRect()
    const maxWidth = Math.max(metaRect.width, userRect.width)
    const maxHeight = Math.max(metaRect.height, userRect.height)

    metaEl.style.minWidth = `${maxWidth}px`
    metaEl.style.minHeight = `${maxHeight}px`
    userEl.style.minWidth = `${maxWidth}px`
    userEl.style.minHeight = `${maxHeight}px`
  }, [
    metascoreDisplay,
    metascoreSubCompact,
    userScoreValue,
    userScoreSubCompact,
    userScorePlatformNote,
    tone,
    userTone,
    settings.layoutMode
  ])

  if (!title) {
    return <></>
  }

  const showMetascore =
    settings.scoreDisplay === 'metascore' || settings.scoreDisplay === 'both'
  const showUserScore =
    (settings.scoreDisplay === 'userscore' || settings.scoreDisplay === 'both') &&
    typeof userScoreValue === 'number'

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
        <FaExternalLinkAlt style={{ marginRight: 4 }} /> {t('badge.viewDetails')}
      </button>
    </div>
  )

  const renderModernLayout = () => (
    <div className="criticdeck-card" data-size={cardSize} data-layout="modern">
      <div className="criticdeck-scores">
        {showMetascore && (
          <div className="criticdeck-score-chip" data-tone={tone}>
            <div className="criticdeck-score-chip-text">
              <span className="criticdeck-score-chip-label">Meta Critic</span>
              <span className="criticdeck-score-chip-sub">{metascoreSub}</span>
            </div>
            <strong className="criticdeck-score-chip-value">{metascoreDisplay}</strong>
          </div>
        )}
        {showUserScore && (
          <div className="criticdeck-score-chip" data-tone={userTone}>
            <div className="criticdeck-score-chip-text">
              <span className="criticdeck-score-chip-label">User Score</span>
              <span className="criticdeck-score-chip-sub">{userScoreSub}</span>
              {userScorePlatformNote && (
                <span className="criticdeck-score-chip-platform-note">
                  {userScorePlatformNote}
                </span>
              )}
            </div>
            <strong className="criticdeck-score-chip-value">
              {userScoreValue.toFixed(1)}
            </strong>
          </div>
        )}
      </div>
      <div className="criticdeck-body">
        <div className="criticdeck-title">{data?.title ?? title}</div>
        <div className="criticdeck-meta">
          {data?.platform || t('badge.platformUnknown')}
          {formattedDate ? ` · ${formattedDate}` : ''}
        </div>
        <div className="criticdeck-status">
          {loading && t('badge.updatingScore')}
          {!loading && error && `⚠️ ${error}`}
          {!loading && !error && label}
        </div>
        {renderActions()}
      </div>
    </div>
  )

  const renderModernCompactLayout = () => (
    <div className="criticdeck-card" data-size={cardSize} data-layout="modern-compact">
      <div className="criticdeck-scores">
        {showMetascore && (
          <div className="criticdeck-score-chip" data-tone={tone} ref={metaChipRef}>
            <span className="criticdeck-score-chip-label">{t('badge.metaScoreLabel')}</span>
            <strong className="criticdeck-score-chip-value">{metascoreDisplay}</strong>
            <span className="criticdeck-score-chip-sub">{metascoreSubCompact}</span>
          </div>
        )}
        {showUserScore && (
          <div className="criticdeck-score-chip" data-tone={userTone} ref={userChipRef}>
            <span className="criticdeck-score-chip-label">{t('badge.userScoreLabel')}</span>
            <strong className="criticdeck-score-chip-value">
              {userScoreValue.toFixed(1)}
            </strong>
            <span className="criticdeck-score-chip-sub">{userScoreSubCompact}</span>
            {userScorePlatformNote && (
              <span className="criticdeck-score-chip-platform-note">
                {userScorePlatformNote}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="criticdeck-body">
        <div className="criticdeck-info">
          <div className="criticdeck-title">{data?.title ?? title}</div>
          <div className="criticdeck-meta">
            {data?.platform || t('badge.platformUnknown')}
            {formattedDate ? ` · ${formattedDate}` : ''}
          </div>
          <div className="criticdeck-status">
            {loading && t('badge.updatingScore')}
            {!loading && error && `⚠️ ${error}`}
            {!loading && !error && label}
          </div>
        </div>
        {renderActions()}
      </div>
    </div>
  )

  const showBothScores = showMetascore && showUserScore

  const renderDefaultLayout = () => (
    <div className="criticdeck-card" data-size={cardSize} data-layout="card">
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
            </span>
          </div>
        )}
        {showUserScore && (
          <div
            className="criticdeck-score-circle"
            data-tone={userTone}
            data-compact={showBothScores}
          >
            <strong>{userScoreValue.toFixed(1)}</strong>
            <span>User</span>
          </div>
        )}
      </div>
      <div className="criticdeck-body">
        <div className="criticdeck-title">{data?.title ?? title}</div>
        <div className="criticdeck-meta">
          {data?.platform || t('badge.platformUnknown')}
          {formattedDate ? ` · ${formattedDate}` : ''}
        </div>
        <div className="criticdeck-status">
          {loading && t('badge.updatingScore')}
          {!loading && error && `⚠️ ${error}`}
          {!loading && !error && label}
        </div>
        {renderActions()}
      </div>
    </div>
  )

  const renderCardLayout = () => {
    if (settings.layoutMode === 'modern-compact') return renderModernCompactLayout()
    if (settings.layoutMode === 'modern') return renderModernLayout()
    return renderDefaultLayout()
  }

  const isBottom = position.startsWith('bottom')
  const bottomOverride: React.CSSProperties =
    isBottom && bannerHeight != null
      ? {
          top: `${Math.max(bannerHeight - (badgeHeight ?? 0) - verticalOffset, 0)}px`,
          bottom: 'auto'
        }
      : {}

  return (
    <div
      ref={rootRef}
      id="criticdeck-badge-container"
      className="criticdeck-badge-root"
      data-position={position}
      style={
        {
          '--criticdeck-offset-x': `${horizontalOffset || 0}px`,
          '--criticdeck-offset-y': `${verticalOffset || 0}px`,
          ...bottomOverride
        } as React.CSSProperties
      }
    >
      {criticDeckStyle}
      {renderCardLayout()}
    </div>
  )
}
