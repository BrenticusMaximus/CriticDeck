import { useEffect, useState } from 'react'

import { useParams } from './useParams'

export type GameOverview = AppOverview | undefined

export const useGameOverview = () => {
  const { appid } = useParams<{ appid: string }>()
  const [overview, setOverview] = useState<GameOverview>()

  useEffect(() => {
    if (!appid) return
    const numericId = parseInt(appid, 10)
    if (Number.isNaN(numericId)) return
    const details = appStore.GetAppOverviewByGameID(numericId)
    setOverview(details)
  }, [appid])

  return overview
}
