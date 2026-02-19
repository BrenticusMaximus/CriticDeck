import { Navigation, PanelSection, PanelSectionRow } from '@decky/ui'
import React from 'react'

import {
  DATE_FORMAT_OPTIONS,
  SCORE_DISPLAY_OPTIONS,
  LAYOUT_OPTIONS,
  POSITION_OPTIONS,
  useSettings
} from '../../hooks/useSettings'
import buildInfo from '../../build-info.json'

const SettingsPanel = () => {
  const { settings, setSetting } = useSettings()

  return (
    <PanelSection title="CriticDeck">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxHeight: '70vh',
          overflowY: 'auto',
          paddingRight: 6
        }}
      >
        <PanelSectionRow>
          CriticDeck fetches scores from Metacritic using the unofficial API
          documented at github.com/chrismichaelps/metacritic.
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 600 }}>Current build</span>
            <span>{buildInfo.timestamp}</span>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <a
            role="button"
            onClick={() =>
              Navigation.NavigateToExternalWeb(
                'https://github.com/chrismichaelps/metacritic'
              )
            }
          >
            View API project ↗
          </a>
        </PanelSectionRow>
        <PanelSectionRow>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 12,
              paddingRight: 12,
              marginLeft: -4
            }}
          >
            <hr
              style={{
                width: '100%',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                margin: '8px 0'
              }}
            />
            <span style={{ paddingLeft: 2, fontWeight: 600 }}>Release date format</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DATE_FORMAT_OPTIONS.map((option) => {
                const checked = settings.dateFormat === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSetting({ dateFormat: option.value })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: checked
                        ? '1px solid rgba(255,255,255,0.6)'
                        : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: checked
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      width: '100%',
                      textAlign: 'left',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12
                      }}
                    >
                      {checked ? '●' : ' '}
                    </span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 12,
              paddingRight: 12,
              marginLeft: -4
            }}
          >
            <span style={{ paddingLeft: 2, fontWeight: 600 }}>Score display</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SCORE_DISPLAY_OPTIONS.map((option) => {
                const checked = settings.scoreDisplay === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSetting({ scoreDisplay: option.value })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: checked
                        ? '1px solid rgba(255,255,255,0.6)'
                        : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: checked
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      width: '100%',
                      textAlign: 'left',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12
                      }}
                    >
                      {checked ? '●' : ' '}
                    </span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 12,
              paddingRight: 12,
              marginLeft: -4
            }}
          >
            <span style={{ paddingLeft: 2, fontWeight: 600 }}>Layout</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LAYOUT_OPTIONS.map((option) => {
                const checked = settings.layoutMode === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSetting({ layoutMode: option.value })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: checked
                        ? '1px solid rgba(255,255,255,0.6)'
                        : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: checked
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      width: '100%',
                      textAlign: 'left',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12
                      }}
                    >
                      {checked ? '●' : ' '}
                    </span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 12,
              paddingRight: 12,
              marginLeft: -4
            }}
          >
            <span style={{ paddingLeft: 2, fontWeight: 600 }}>Card position</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {POSITION_OPTIONS.map((option) => {
                const checked = settings.position === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSetting({ position: option.value })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: checked
                        ? '1px solid rgba(255,255,255,0.6)'
                        : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: checked
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      width: '100%',
                      textAlign: 'left',
                      color: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12
                      }}
                    >
                      {checked ? '●' : ' '}
                    </span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 12,
              paddingRight: 12,
              marginLeft: -4
            }}
          >
            <span style={{ paddingLeft: 2, fontWeight: 600 }}>Card offset</span>
            <div style={{ display: 'flex', gap: 14, flexDirection: 'column' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ opacity: 0.8 }}>Horizontal (px)</span>
                  <span style={{ opacity: 0.8 }}>{settings.horizontalOffset}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={settings.horizontalOffset}
                  onChange={(e) =>
                    setSetting({
                      horizontalOffset: Math.max(0, parseInt(e.target.value || '0', 10))
                    })
                  }
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ opacity: 0.8 }}>Vertical (px)</span>
                  <span style={{ opacity: 0.8 }}>{settings.verticalOffset}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={settings.verticalOffset}
                  onChange={(e) =>
                    setSetting({
                      verticalOffset: Math.max(0, parseInt(e.target.value || '0', 10))
                    })
                  }
                  style={{ width: '100%' }}
                />
              </label>
            </div>
          </div>
        </PanelSectionRow>
      </div>
    </PanelSection>
  )
}

export default SettingsPanel
