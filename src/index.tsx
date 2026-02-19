import React from 'react'
import { definePlugin, staticClasses } from '@decky/ui'
import { routerHook } from '@decky/api'
import { FaStar } from 'react-icons/fa'

import SettingsPanel from './components/Settings'
import { patchLibraryApp } from './lib/patchLibraryApp'

export default definePlugin(() => {
  const libraryPatch = patchLibraryApp()

  return {
    title: <div className={staticClasses.Title}>CriticDeck</div>,
    icon: <FaStar />,
    content: <SettingsPanel />,
    onDismount() {
      routerHook.removePatch('/library/app/:appid', libraryPatch)
    }
  }
})
