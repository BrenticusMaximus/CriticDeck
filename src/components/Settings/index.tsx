import {
  ButtonItem,
  DropdownItem,
  Navigation,
  PanelSection,
  PanelSectionRow,
  SliderField
} from '@decky/ui'
import React, { useState } from 'react'

import { clearMetacriticCache } from '../../hooks/useMetacriticScore'
import { LANGUAGE_OPTIONS, useTranslation, TranslationKey } from '../../i18n'
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
  options: ReadonlyArray<{ value: T; labelKey: TranslationKey }>
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
}: OptionGroupProps<T>) => {
  const { t } = useTranslation()
  return (
    <DropdownItem
      label={title}
      layout="below"
      rgOptions={options.map((option) => ({ data: option.value, label: t(option.labelKey) }))}
      selectedOption={value}
      onChange={(selected) => onSelect(selected.data as T)}
    />
  )
}

// Padding (not margin) reliably reserves space between rows even when a
// margin alone would collapse against a PanelSectionRow boundary.
const settingRowStyle: React.CSSProperties = { paddingTop: 10 }

const SettingsPanel = () => {
  const { settings, setSetting } = useSettings()
  const { t } = useTranslation()
  const [cacheCleared, setCacheCleared] = useState(false)

  return (
    <PanelSection title="CriticDeck">
      <PanelSectionRow>{t('settings.intro')}</PanelSectionRow>
      <PanelSectionRow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 600 }}>{t('settings.currentBuild')}</span>
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
          {t('settings.viewApiProject')}
        </a>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title={t('settings.releaseDateFormat')}
            options={DATE_FORMAT_OPTIONS}
            value={settings.dateFormat}
            onSelect={(dateFormat) => setSetting({ dateFormat })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title={t('settings.scoreDisplay')}
            options={SCORE_DISPLAY_OPTIONS}
            value={settings.scoreDisplay}
            onSelect={(scoreDisplay) => setSetting({ scoreDisplay })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title={t('settings.layout')}
            options={LAYOUT_OPTIONS}
            value={settings.layoutMode}
            onSelect={(layoutMode) => setSetting({ layoutMode })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <OptionGroup
            title={t('settings.cardPosition')}
            options={POSITION_OPTIONS}
            value={settings.position}
            onSelect={(position) => setSetting({ position })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <SliderField
            label={t('settings.horizontalOffset')}
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
            label={t('settings.verticalOffset')}
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
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <SliderField
            label={t('settings.cacheDuration')}
            layout="below"
            description={t('settings.cacheDurationDesc')}
            value={settings.cacheDays}
            min={1}
            max={30}
            step={1}
            showValue
            valueSuffix=" days"
            onChange={(cacheDays) => setSetting({ cacheDays })}
          />
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <ButtonItem
            layout="below"
            onClick={() => {
              clearMetacriticCache()
              setCacheCleared(true)
            }}
          >
            {t(cacheCleared ? 'settings.clearCacheDone' : 'settings.clearCache')}
          </ButtonItem>
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div style={settingRowStyle}>
          <DropdownItem
            label={t('settings.language')}
            layout="below"
            rgOptions={LANGUAGE_OPTIONS.map((option) => ({
              data: option.value,
              label: t(option.label)
            }))}
            selectedOption={settings.language}
            onChange={(selected) => setSetting({ language: selected.data })}
          />
        </div>
      </PanelSectionRow>
    </PanelSection>
  )
}

export default SettingsPanel
