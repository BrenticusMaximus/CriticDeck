import {
  afterPatch,
  appDetailsClasses,
  createReactTreePatcher,
  findInReactTree
} from '@decky/ui'
import { routerHook } from '@decky/api'
import React, { ReactElement } from 'react'

import { MetacriticBadge } from '../components/MetacriticBadge'
import { GameOverview } from '../hooks/useGameOverview'

export function patchLibraryApp() {
  return routerHook.addPatch('/library/app/:appid', (tree: any) => {
    const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc)
    if (!routeProps) {
      return tree
    }

    const patchHandler = createReactTreePatcher(
      [
        (root: any) =>
          findInReactTree(root, (node: any) => node?.props?.children?.props?.overview)?.props?.children
      ],
      (nodes: Array<Record<string, unknown>>, ret?: ReactElement) => {
        const overview = (nodes?.[0] as { overview?: GameOverview } | undefined)?.overview

        const container = findInReactTree(
          ret,
          (element: ReactElement) =>
            Array.isArray(element?.props?.children) &&
            element?.props?.className?.includes(appDetailsClasses.InnerContainer)
        )
        if (!container) {
          return ret
        }

        // Avoid inserting duplicate badges if Decky re-renders the tree
        const hasBadge = container.props.children.some(
          (child: ReactElement) => child?.props?.id === 'criticdeck-badge-container'
        )
        if (!hasBadge) {
          container.props.children.splice(
            1,
            0,
            <MetacriticBadge key="criticdeck" overview={overview} />
          )
        }

        return ret
      }
    )

    afterPatch(routeProps, 'renderFunc', patchHandler)
    return tree
  })
}
