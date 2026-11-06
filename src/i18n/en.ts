/**
 * English (default/fallback) translations
 */
export const en = {
  // Settings - intro / about
  'settings.intro':
    'CriticDeck fetches scores from Metacritic using the unofficial API documented at github.com/chrismichaelps/metacritic.',
  'settings.currentBuild': 'Current build',
  'settings.viewApiProject': 'View API project ↗',

  // Settings - fields
  'settings.releaseDateFormat': 'Release date format',
  'settings.scoreDisplay': 'Score display',
  'settings.layout': 'Layout',
  'settings.cardPosition': 'Card position',
  'settings.horizontalOffset': 'Horizontal offset',
  'settings.verticalOffset': 'Vertical offset',
  'settings.cacheDuration': 'Cache duration',
  'settings.cacheDurationDesc':
    'How long a successfully fetched score stays cached before being refreshed.',

  // Settings - language
  'settings.language': 'Language',
  'settings.languageAuto': 'Automatic (System)',
  'settings.languageEnglish': 'English',
  'settings.languagePortuguese': 'Português (Brasil)',

  // Settings - date format options
  'settings.dateFormat.MDY': 'MDY (Month, day, year)',
  'settings.dateFormat.DMY': 'DMY (Day, month, year)',
  'settings.dateFormat.YMD': 'YMD (Year, month, day)',
  'settings.dateFormat.JUL': 'JUL (yy/ddd)',
  'settings.dateFormat.ISO': 'ISO (YYYY-MM-DD)',
  'settings.dateFormat.USA': 'USA (MM/DD/YYYY)',
  'settings.dateFormat.EUR': 'EUR (DD.MM.YYYY)',
  'settings.dateFormat.JIS': 'JIS (YYYY-MM-DD)',

  // Settings - score display options
  'settings.scoreDisplay.metascore': 'Metascore only',
  'settings.scoreDisplay.userscore': 'User score only',
  'settings.scoreDisplay.both': 'Both scores',

  // Settings - layout options
  'settings.layout.card': 'Default card',
  'settings.layout.modern': 'Modern',
  'settings.layout.modernCompact': 'Modern Compact',

  // Settings - position options
  'settings.position.topRight': 'Top right',
  'settings.position.topLeft': 'Top left',
  'settings.position.topCenter': 'Top center',
  'settings.position.bottomRight': 'Bottom right',
  'settings.position.bottomLeft': 'Bottom left',
  'settings.position.bottomCenter': 'Bottom center',

  // Badge (score chips + card)
  'badge.metaScoreLabel': 'CRITIC',
  'badge.userScoreLabel': 'USERS',
  'badge.outOfMax': 'of {max}',
  'badge.outOfTen': 'of 10',
  'badge.viewDetails': 'View Details',
  'badge.updatingScore': 'Updating Metacritic score…',
  'badge.platformUnknown': 'Platform unknown',
  'badge.noScoreYet': 'No score yet',
  'badge.metascoreFallback': 'Metascore',
  'badge.tbd': 'TBD',

  // Metacritic API - status/error text
  'metacritic.notFound': 'No Metacritic entry found',
  'metacritic.unableToLoadDetails': 'Unable to load Metacritic details',
  'metacritic.unableToContact': 'Unable to contact Metacritic',
  'metacritic.unexpectedError': 'Unexpected error',
  'metacritic.ofRatingsCount': 'based on {count} ratings',
  'metacritic.ratingsCountShort': '{count} ratings',
  'metacritic.ofCriticReviewsCount': 'based on {count} critic reviews',
  'metacritic.criticReviewsCountShort': '{count} reviews',

  // Metacritic API - sentiment labels (fixed vocabulary returned by the API)
  'metacritic.sentiment.universalAcclaim': 'Universal acclaim',
  'metacritic.sentiment.generallyFavorable': 'Generally favorable',
  'metacritic.sentiment.mixedOrAverage': 'Mixed or average',
  'metacritic.sentiment.mixedOrAverageReviews': 'Mixed or average reviews',
  'metacritic.sentiment.generallyUnfavorable': 'Generally unfavorable',
  'metacritic.sentiment.overwhelmingDislike': 'Overwhelming dislike',

  // Month names (used when formatting release dates)
  'month.january': 'January',
  'month.february': 'February',
  'month.march': 'March',
  'month.april': 'April',
  'month.may': 'May',
  'month.june': 'June',
  'month.july': 'July',
  'month.august': 'August',
  'month.september': 'September',
  'month.october': 'October',
  'month.november': 'November',
  'month.december': 'December'
}

export type TranslationKey = keyof typeof en
