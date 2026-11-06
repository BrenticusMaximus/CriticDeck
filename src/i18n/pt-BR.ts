import { en } from './en'

/**
 * Brazilian Portuguese translations
 */
export const ptBR: Record<keyof typeof en, string> = {
  // Settings - intro / about
  'settings.intro':
    'O CriticDeck busca notas da Metacritic usando a API não oficial documentada em github.com/chrismichaelps/metacritic.',
  'settings.currentBuild': 'Build atual',
  'settings.viewApiProject': 'Ver projeto da API ↗',

  // Settings - fields
  'settings.releaseDateFormat': 'Formato da data de lançamento',
  'settings.scoreDisplay': 'Exibição de nota',
  'settings.layout': 'Layout',
  'settings.cardPosition': 'Posição do cartão',
  'settings.horizontalOffset': 'Deslocamento horizontal',
  'settings.verticalOffset': 'Deslocamento vertical',
  'settings.cacheDuration': 'Duração do cache',
  'settings.cacheDurationDesc':
    'Por quanto tempo uma nota obtida com sucesso fica em cache antes de ser atualizada novamente.',

  // Settings - language
  'settings.language': 'Idioma',
  'settings.languageAuto': 'Automático (Sistema)',
  'settings.languageEnglish': 'English',
  'settings.languagePortuguese': 'Português (Brasil)',

  // Settings - date format options
  'settings.dateFormat.MDY': 'MDY (Mês, dia, ano)',
  'settings.dateFormat.DMY': 'DMY (Dia, mês, ano)',
  'settings.dateFormat.YMD': 'YMD (Ano, mês, dia)',
  'settings.dateFormat.JUL': 'JUL (aa/ddd)',
  'settings.dateFormat.ISO': 'ISO (AAAA-MM-DD)',
  'settings.dateFormat.USA': 'USA (MM/DD/AAAA)',
  'settings.dateFormat.EUR': 'EUR (DD.MM.AAAA)',
  'settings.dateFormat.JIS': 'JIS (AAAA-MM-DD)',

  // Settings - score display options
  'settings.scoreDisplay.metascore': 'Somente Metascore',
  'settings.scoreDisplay.userscore': 'Somente nota dos usuários',
  'settings.scoreDisplay.both': 'Ambas as notas',

  // Settings - layout options
  'settings.layout.card': 'Cartão padrão',
  'settings.layout.modern': 'Moderno',

  // Settings - position options
  'settings.position.topRight': 'Superior direita',
  'settings.position.topLeft': 'Superior esquerda',
  'settings.position.topCenter': 'Superior centro',
  'settings.position.bottomRight': 'Inferior direita',
  'settings.position.bottomLeft': 'Inferior esquerda',
  'settings.position.bottomCenter': 'Inferior centro',

  // Badge (score chips + card)
  'badge.metaScoreLabel': 'CRÍTICA',
  'badge.userScoreLabel': 'USUÁRIOS',
  'badge.outOfMax': 'de {max}',
  'badge.outOfTen': 'de 10',
  'badge.viewDetails': 'Ver detalhes',
  'badge.updatingScore': 'Atualizando nota da Metacritic…',
  'badge.platformUnknown': 'Plataforma desconhecida',
  'badge.noScoreYet': 'Sem nota ainda',
  'badge.metascoreFallback': 'Nota Metacritic',
  'badge.tbd': 'A definir',

  // Metacritic API - status/error text
  'metacritic.notFound': 'Nenhuma entrada encontrada na Metacritic',
  'metacritic.unableToLoadDetails': 'Não foi possível carregar os detalhes da Metacritic',
  'metacritic.unableToContact': 'Não foi possível contatar a Metacritic',
  'metacritic.unexpectedError': 'Erro inesperado',
  'metacritic.ofRatingsCount': 'de {count} avaliações',

  // Metacritic API - sentiment labels (fixed vocabulary returned by the API)
  'metacritic.sentiment.universalAcclaim': 'Aclamação universal',
  'metacritic.sentiment.generallyFavorable': 'Geralmente favorável',
  'metacritic.sentiment.mixedOrAverage': 'Mista ou mediana',
  'metacritic.sentiment.mixedOrAverageReviews': 'Análises mistas ou medianas',
  'metacritic.sentiment.generallyUnfavorable': 'Geralmente desfavorável',
  'metacritic.sentiment.overwhelmingDislike': 'Rejeição generalizada',

  // Month names (used when formatting release dates)
  'month.january': 'Janeiro',
  'month.february': 'Fevereiro',
  'month.march': 'Março',
  'month.april': 'Abril',
  'month.may': 'Maio',
  'month.june': 'Junho',
  'month.july': 'Julho',
  'month.august': 'Agosto',
  'month.september': 'Setembro',
  'month.october': 'Outubro',
  'month.november': 'Novembro',
  'month.december': 'Dezembro'
}
