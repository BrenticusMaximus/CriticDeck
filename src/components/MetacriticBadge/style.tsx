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
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 72px;
    }

    .criticdeck-scores[data-compact='true'] {
      position: relative;
      min-width: 72px;
      min-height: 124px;
      gap: 0;
    }

    .criticdeck-score-circle,
    .criticdeck-score-square {
      width: 72px;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      text-align: center;
      padding: 6px;
    }

    .criticdeck-score-square {
      justify-content: center;
      padding-top: 8px;
      padding-bottom: 8px;
      gap: 0;
      background-clip: padding-box;
    }

    .criticdeck-score-label {
      display: flex;
      flex-direction: column;
      text-align: center;
      line-height: 1;
      font-weight: 600;
      gap: 0;
    }

    .criticdeck-score-square strong {
      display: block;
      line-height: 1;
      margin: 0;
    }

    .criticdeck-score-label span {
      display: block;
      line-height: 1;
    }

    .criticdeck-score-circle strong,
    .criticdeck-score-square strong {
      font-size: 22px;
      line-height: 1.1;
    }

    .criticdeck-score-circle {
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
    }

    .criticdeck-scores[data-compact='true'] .criticdeck-score-square,
    .criticdeck-scores[data-compact='true'] .criticdeck-score-circle {
      position: absolute;
      padding: 4px;
      font-size: 11px;
      justify-content: center;
      gap: 2px;
    }

    .criticdeck-score-square[data-compact='true'] {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }

    .criticdeck-score-circle[data-compact='true'] {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      left: 50%;
      top: 72px;
      transform: translateX(-50%);
    }

    .criticdeck-score-circle[data-compact='true'] strong,
    .criticdeck-score-square[data-compact='true'] strong {
      font-size: 16px;
    }

    .criticdeck-score-circle[data-tone='great'],
    .criticdeck-score-square[data-tone='great'] {
      background: linear-gradient(135deg, #1b5e20, #43a047);
    }

    .criticdeck-score-circle[data-tone='good'],
    .criticdeck-score-square[data-tone='good'] {
      background: linear-gradient(135deg, #f57f17, #ffb74d);
    }

    .criticdeck-score-circle[data-tone='weak'],
    .criticdeck-score-square[data-tone='weak'] {
      background: linear-gradient(135deg, #b71c1c, #e57373);
    }

    .criticdeck-score-circle[data-tone='unknown'],
    .criticdeck-score-square[data-tone='unknown'] {
      background: rgba(255, 255, 255, 0.25);
    }

    .criticdeck-score-square {
      border-radius: 18px;
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
  `}</style>
)
