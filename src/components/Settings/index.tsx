import { DropdownItem, Navigation, PanelSection, PanelSectionRow, SliderField } from '@decky/ui'
import React from 'react'

import {
  DATE_FORMAT_OPTIONS,
  SCORE_DISPLAY_OPTIONS,
  LAYOUT_OPTIONS,
  POSITION_OPTIONS,
  useSettings
} from '../../hooks/useSettings'
import buildInfo from '../../build-info.json'

type OptionGroupProps<T extends string> = {
  title: string
  options: ReadonlyArray<{ value: T; label: string }>
  value: T
  onSelect: (value: T) => void
}

// Native Dropdown - the component Decky/SteamUI itself uses for single-choice
// settings, so gamepad/trackpad navigation and sizing come for free.
const OptionGroup = <T extends string>({
  title,
  options,
  value,
  onSelect
}: OptionGroupProps<T>) => (
  <DropdownItem
    label={title}
    layout="below"
    rgOptions={options.map((option) => ({ data: option.value, label: option.label }))}
    selectedOption={value}
    onChange={(selected) => onSelect(selected.data as T)}
  />
)

// Padding (not margin) reliably reserves space between rows even when a
// margin alone would collapse against a PanelSectionRow boundary.
const settingRowStyle: React.CSSProperties = { paddingTop: 10 }

const SettingsPanel = () => {
  const { settings, setSetting } = useSettings()

  return (
    <PanelSection title="CriticDeck">
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
        <div style={settingRowStyle}>
          <OptionGroup
            title="Release date format"
            options={DATE_FORMAT_OPTIONS}
            value={settings.dateFormat}
            onSelect={(dateFormat) => setSetting({ dateFormat })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title="Score display"
            options={SCORE_DISPLAY_OPTIONS}
            value={settings.scoreDisplay}
            onSelect={(scoreDisplay) => setSetting({ scoreDisplay })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title="Layout"
            options={LAYOUT_OPTIONS}
            value={settings.layoutMode}
            onSelect={(layoutMode) => setSetting({ layoutMode })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title="Card position"
            options={POSITION_OPTIONS}
            value={settings.position}
            onSelect={(position) => setSetting({ position })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <SliderField
            label="Horizontal offset"
            layout="below"
            value={settings.horizontalOffset}
            min={0}
            max={200}
            step={1}
            showValue
            valueSuffix="px"
            onChange={(horizontalOffset) => setSetting({ horizontalOffset })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <SliderField
            label="Vertical offset"
            layout="below"
            value={settings.verticalOffset}
            min={0}
            max={300}
            step={1}
            showValue
            valueSuffix="px"
            onChange={(verticalOffset) => setSetting({ verticalOffset })}
          />
        </div>
      </PanelSectionRow>
    </PanelSection>
  )
}

export default SettingsPanel
