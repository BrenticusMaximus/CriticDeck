import React from 'react'

export const criticDeckStyle = (
  <style>{`
    .criticdeck-badge-root {
      position: absolute;
      z-index: 2;
      --criticdeck-offset-x: 24px;
      --criticdeck-offset-y: 56px;
    }

    .criticdeck-badge-root[data-position='top-right'] {
      top: var(--criticdeck-offset-y);
      right: var(--criticdeck-offset-x);
    }
    .criticdeck-badge-root[data-position='bottom-right'] {
      bottom: var(--criticdeck-offset-y);
      right: var(--criticdeck-offset-x);
    }
    .criticdeck-badge-root[data-position='top-left'] {
      top: var(--criticdeck-offset-y);
      left: var(--criticdeck-offset-x);
    }
    .criticdeck-badge-root[data-position='bottom-left'] {
      bottom: var(--criticdeck-offset-y);
      left: var(--criticdeck-offset-x);
    }
    .criticdeck-badge-root[data-position='top-center'] {
      top: var(--criticdeck-offset-y);
      left: 50%;
      transform: translateX(-50%);
    }
    .criticdeck-badge-root[data-position='bottom-center'] {
      bottom: var(--criticdeck-offset-y);
      left: 50%;
      transform: translateX(-50%);
    }

    .criticdeck-card {
      min-width: 220px;
      max-width: 320px;
      background: rgba(12, 12, 12, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 12px 14px;
      display: flex;
      gap: 12px;
      color: #f5f5f5;
      font-family: var(--font-family, "Motiva Sans");
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(4px);
    }

    .criticdeck-scores {
      display: grid;
      gap: 8px;
      min-width: 118px;
    }

    .criticdeck-score-chip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.08);
      padding: 7px 8px;
      min-height: 54px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }

    .criticdeck-score-chip-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .criticdeck-score-chip-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.9);
    }

    .criticdeck-score-chip-sub {
      font-size: 10px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.2;
      white-space: normal;
      overflow-wrap: anywhere;
      max-width: 70px;
    }

    .criticdeck-score-chip-value {
      font-size: 22px;
      font-weight: 800;
      line-height: 1;
      color: #fff;
    }

    .criticdeck-score-chip[data-tone='great'] {
      background: linear-gradient(
        135deg,
        rgba(67, 160, 71, 0.35),
        rgba(67, 160, 71, 0.12)
      );
      border-color: rgba(67, 160, 71, 0.55);
    }

    .criticdeck-score-chip[data-tone='good'] {
      background: linear-gradient(
        135deg,
        rgba(255, 183, 77, 0.35),
        rgba(255, 183, 77, 0.12)
      );
      border-color: rgba(255, 183, 77, 0.55);
    }

    .criticdeck-score-chip[data-tone='weak'] {
      background: linear-gradient(
        135deg,
        rgba(229, 115, 115, 0.35),
        rgba(229, 115, 115, 0.12)
      );
      border-color: rgba(229, 115, 115, 0.55);
    }

    .criticdeck-score-chip[data-tone='unknown'] {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.16);
    }

    .criticdeck-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .criticdeck-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .criticdeck-meta {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
    }

    .criticdeck-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 6px;
    }

    .criticdeck-actions button {
      border: none;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      transition: background 0.15s ease;
    }

    .criticdeck-actions button:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .criticdeck-status {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }

    .criticdeck-user-reviews {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.65);
      text-align: center;
      padding-top: 2px;
    }
    /* Single size */
    .criticdeck-card[data-size='card'] {
      min-width: 240px;
      max-width: 300px;
    }

    /* "Modern" layout - a two-column grid redesign of the card above,
       selected independently via the Layout setting. Every rule here is
       scoped under [data-layout='modern'] so it only ever overrides the
       classic layout's rules on the attribute-tagged root, never the
       classic layout itself. */
    .criticdeck-card[data-layout='modern'] {
      --criticdeck-gutter: 0.75rem;
      --criticdeck-v-gutter: 0.375rem;
      min-width: 13.75rem;
      max-width: 20rem;
      padding: var(--criticdeck-v-gutter) var(--criticdeck-gutter);
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--criticdeck-gutter);
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-scores {
      display: grid;
      grid-template-columns: auto;
      align-content: start;
      align-self: start;
      gap: 0.5rem;
      min-width: 0;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-score-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: start;
      justify-content: center;
      text-align: center;
      gap: 0.0625rem;
      width: fit-content;
      min-height: 0;
      padding: 0.25rem;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-score-chip-label {
      font-size: 0.5rem;
      letter-spacing: 0.06em;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-score-chip-sub {
      font-size: 0.5625rem;
      max-width: none;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-score-chip-value {
      font-size: 1.25rem;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-body {
      flex: initial;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
      text-align: center;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: auto;
      margin-bottom: auto;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-title {
      font-size: 0.84375rem;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-meta {
      font-size: 0.65625rem;
      margin-bottom: 0.0625rem;
      color: rgba(210, 210, 210, 0.55);
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-actions {
      margin-top: 0;
      margin-bottom: calc(var(--criticdeck-v-gutter) * 2);
      gap: 0.375rem;
      width: 100%;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-actions button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 62.4375rem;
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
    }

    .criticdeck-card[data-layout='modern'] .criticdeck-status {
      font-size: 0.8125rem;
    }
  `}</style>
)
