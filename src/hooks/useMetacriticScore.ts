import { fetchNoCors } from '@decky/api'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type MetacriticScorePayload = {
  found: boolean
  title?: string
  matched_title?: string
  slug?: string
  platform?: string
  platforms?: string[]
  score?: number
  score_max?: number
  sentiment?: string
  release_date?: string
  description?: string
  metacritic_url?: string
  user_score?: number
  user_sentiment?: string
  user_review_count?: string
  user_review_breakdown?: ReviewBreakdown
  critic_review_count?: string
  critic_review_breakdown?: ReviewBreakdown
  must_play?: boolean
  error?: string
}

type ReviewBreakdown = {
  positive?: number
  mixed?: number
  negative?: number
}

type SearchItem = {
  title: string
  slug: string
  type: string
  platforms?: { name?: string }[]
  criticScoreSummary?: { score?: number }
}

type ScoreResponse = {
  data?: {
    item?: ScoreItem
  }
}

type ScoreItem = {
  title?: string
  slug?: string
  description?: string
  platform?: string
  releaseDate?: string
  criticScoreSummary?: CriticSummary
  platforms?: PlatformEntry[]
}

type PlatformEntry = {
  name?: string
  slug?: string
  releaseDate?: string
  criticScoreSummary?: CriticSummary
}

type CriticSummary = {
  url?: string
  max?: number
  score?: number
  sentiment?: string
}

const SEARCH_ENDPOINT = (
  query: string
) =>
  `https://backend.metacritic.com/finder/metacritic/search/${query}/web?offset=0&limit=50&mcoTypeId=13`
const SCORES_ENDPOINT = (
  slug: string
) =>
  `https://backend.metacritic.com/games/metacritic/${slug}/web?componentName=scores&componentDisplayName=Scores&componentType=ScoreSummary`

const USER_AGENT =
  'CriticDeck/0.1 (+https://github.com/chrismichaelps/metacritic)'

const CACHE_KEY = 'criticdeck.cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

const normalize = (value?: string | null) =>
  (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()

const requestJson = async (url: string) => {
  const response = await fetchNoCors(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT
    }
  })
  if (!response.ok) {
    throw new Error(`Metacritic request failed (${response.status})`)
  }
  return response.json() as Promise<any>
}

const pickBestMatch = (
  items: SearchItem[],
  title: string,
  platformHint: string
) => {
  const normalizedTarget = normalize(title)
  const normalizedPlatform = normalize(platformHint)

  let bestScore = 0
  let bestMatch: SearchItem | undefined
  for (const item of items) {
    if (item.type !== 'game-title') {
      continue
    }
    const normalizedTitle = normalize(item.title)
    if (!normalizedTitle.length) continue

    let similarity = 0
    const minLen = Math.min(normalizedTarget.length, normalizedTitle.length)
    for (let i = 0; i < minLen; i++) {
      if (normalizedTarget[i] === normalizedTitle[i]) {
        similarity += 1
      } else {
        break
      }
    }
    if (normalizedTitle.includes(normalizedTarget)) {
      similarity += normalizedTarget.length
    }
    if (
      normalizedPlatform &&
      item.platforms?.some((p) => normalize(p.name) === normalizedPlatform)
    ) {
      similarity += 5
    }
    if (item.criticScoreSummary?.score) {
      similarity += 1
    }
    if (similarity > bestScore) {
      bestScore = similarity
      bestMatch = item
    }
  }
  return bestMatch
}

const resolvePlatformEntry = (
  item: ScoreItem | undefined,
  preferredPlatform: string
) => {
  if (!item?.platforms?.length) {
    return undefined
  }
  const normalizedPreferred = normalize(preferredPlatform)
  return item.platforms.find(
    (platformEntry: PlatformEntry) =>
      normalize(platformEntry.name) === normalizedPreferred
  )
}

const toAbsoluteUrl = (url?: string | null) => {
  if (!url) return undefined
  return url.startsWith('http')
    ? url
    : `https://www.metacritic.com${url}`
}

const queryMetacritic = async (
  title: string,
  platform: string
): Promise<MetacriticScorePayload> => {
  try {
    const searchData = await requestJson(SEARCH_ENDPOINT(encodeURIComponent(title)))
    const items: SearchItem[] = searchData?.data?.items ?? []
    const match = pickBestMatch(items, title, platform)
    if (!match?.slug) {
      return { found: false, error: 'No Metacritic entry found' }
    }
    const scoreData: ScoreResponse = await requestJson(SCORES_ENDPOINT(match.slug))
    const detail = scoreData?.data?.item
    if (!detail) {
      return { found: false, error: 'Unable to load Metacritic details' }
    }
    const normalizedPreferred = normalize(platform)
    const platformEntry = resolvePlatformEntry(detail, platform)
    const detailMatchesPreferred =
      !platformEntry && normalize(detail.platform || '') === normalizedPreferred
    const criticSummary = platformEntry
      ? platformEntry.criticScoreSummary
      : detailMatchesPreferred
        ? detail.criticScoreSummary
        : undefined
    const fallbackPlatformSlug = platformEntry?.slug?.toLowerCase() || 'pc'
    const releaseDate = platformEntry
      ? platformEntry.releaseDate
      : detailMatchesPreferred
        ? detail.releaseDate
        : undefined
    const platformName = platformEntry
      ? platformEntry.name
      : detailMatchesPreferred
        ? detail.platform
        : undefined
    const [userScore, criticExtras] = await Promise.all([
      fetchUserScore(criticSummary?.url),
      fetchCriticExtras(criticSummary?.url)
    ])

    const criticReviewsPath =
      criticSummary?.url ||
      (match.slug
        ? `/game/${match.slug}/critic-reviews/?platform=${fallbackPlatformSlug}`
        : undefined)
    const metacriticUrl = criticReviewsPath ? toAbsoluteUrl(criticReviewsPath) : undefined

    return {
      found: !!criticSummary,
      title: detail.title || match.title,
      matched_title: match.title,
      slug: match.slug,
      platform: platformName || platform,
      platforms: detail.platforms
        ?.map((p) => p.name)
        .filter((p): p is string => Boolean(p)),
      score: criticSummary?.score || undefined,
      score_max: criticSummary?.max || undefined,
      sentiment: criticSummary?.sentiment,
      release_date: releaseDate,
      description: detail.description,
      metacritic_url: metacriticUrl,
      user_score: userScore?.score,
      user_sentiment: userScore?.sentiment,
      user_review_count: userScore?.reviewCount,
      user_review_breakdown: userScore?.breakdown,
      critic_review_count: criticExtras?.reviewCount,
      critic_review_breakdown: criticExtras?.breakdown,
      must_play: criticExtras?.mustPlay
    }
  } catch (err) {
    return {
      found: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unable to contact Metacritic'
    }
  }
}

const getCached = (key: string) => {
  if (typeof localStorage === 'undefined') return undefined
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as Record<
      string,
      { timestamp: number; payload: MetacriticScorePayload }
    >
    return parsed[key]
  } catch (_err) {
    return undefined
  }
}

const setCached = (key: string, payload: MetacriticScorePayload) => {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, any>) : {}
    parsed[key] = { timestamp: Date.now(), payload }
    localStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
  } catch (_err) {
    // ignore cache errors
  }
}

export const useMetacriticScore = (title?: string | null) => {
  const [data, setData] = useState<MetacriticScorePayload | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const normalizedTitle = useMemo(() => title?.trim(), [title])
  const cacheKey = useMemo(() => normalize(normalizedTitle || ''), [normalizedTitle])

  const refresh = useCallback(async () => {
    if (!normalizedTitle) return
    const cached = cacheKey ? getCached(cacheKey) : undefined
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setData(cached.payload)
      return
    }

    setLoading(true)
    setError(undefined)
    try {
      const result = await queryMetacritic(normalizedTitle, 'PC')
      if (result.found && cacheKey) {
        setCached(cacheKey, result)
      }
      setData(result)
      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      if (cached) {
        setData(cached.payload)
        setError(undefined)
      } else {
        setError(err instanceof Error ? err.message : 'Unexpected error')
        setData(undefined)
      }
    } finally {
      setLoading(false)
    }
  }, [normalizedTitle, cacheKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

const fetchUserScore = async (
  criticUrl?: string | null
): Promise<
  | {
      score: number
      sentiment?: string
      reviewCount?: string
      breakdown?: ReviewBreakdown
    }
  | undefined
> => {
  if (!criticUrl) return undefined
  const userPath = criticUrl.replace('critic-reviews', 'user-reviews')
  const targetUrl = deriveMainPageUrl(userPath)
  if (!targetUrl) return undefined

  try {
    const response = await fetchNoCors(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'User-Agent': USER_AGENT
      }
    })
    if (!response.ok) return undefined
    const html = await response.text()
    const scoreMatch = html.match(/User score ([0-9.]+) out of 10/i)
    if (!scoreMatch) return undefined
    const scoreValue = parseFloat(scoreMatch[1])
    if (!scoreValue || Number.isNaN(scoreValue)) {
      return undefined
    }
    const sentimentMatch = html.match(
      /data-testid="user-score-info"[\s\S]*?scoreSentiment[^>]*>([^<]+)</i
    )
    const reviewsMatch = html.match(
      /data-testid="user-score-info"[\s\S]*?Based on ([^<]+)</i
    )
    const breakdown = extractBreakdown(html)

    return {
      score: scoreValue,
      sentiment: sentimentMatch?.[1]?.trim(),
      reviewCount: reviewsMatch ? `Based on ${reviewsMatch[1].trim()}` : undefined,
      breakdown
    }
  } catch (_error) {
    return undefined
  }
}

const fetchCriticExtras = async (
  criticUrl?: string | null
): Promise<
  | {
      reviewCount?: string
      breakdown?: ReviewBreakdown
      mustPlay?: boolean
    }
  | undefined
> => {
  if (!criticUrl) return undefined
  const targetUrl = deriveMainPageUrl(criticUrl)
  if (!targetUrl) return undefined
  try {
    const response = await fetchNoCors(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'User-Agent': USER_AGENT
      }
    })
    if (!response.ok) return undefined
    const html = await response.text()
    const reviewMatch = html.match(/Based on\s+([\d,]+)\s+Critic Reviews/i)
    const breakdown = extractBreakdown(html)
    const mustPlay = /Must-Play/i.test(html)
    return {
      reviewCount: reviewMatch ? `Based on ${reviewMatch[1]} Critic Reviews` : undefined,
      breakdown,
      mustPlay
    }
  } catch (_error) {
    return undefined
  }
}

const deriveMainPageUrl = (criticUrl: string) => {
  const withoutTrailing = criticUrl.replace(/(critic-reviews|user-reviews).*$/, '')
  return toAbsoluteUrl(withoutTrailing.endsWith('/') ? withoutTrailing : `${withoutTrailing}/`)
}

const extractBreakdown = (html: string): ReviewBreakdown | undefined => {
  const positiveMatch = html.match(/Positive[^0-9]{0,8}(\d{1,5})/i)
  const mixedMatch = html.match(/Mixed[^0-9]{0,8}(\d{1,5})/i)
  const negativeMatch = html.match(/Negative[^0-9]{0,8}(\d{1,5})/i)
  if (!positiveMatch && !mixedMatch && !negativeMatch) return undefined
  return {
    positive: positiveMatch ? parseInt(positiveMatch[1], 10) : undefined,
    mixed: mixedMatch ? parseInt(mixedMatch[1], 10) : undefined,
    negative: negativeMatch ? parseInt(negativeMatch[1], 10) : undefined
  }
}
