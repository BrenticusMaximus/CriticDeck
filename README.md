# CriticDeck Documentation

CriticDeck brings **Metacritic critic scores directly into Steam Deck library pages** so you can evaluate games at a glance without leaving Gaming Mode.

**Latest update (v1.0.1):** Fixed incorrect title matching and switched score detail retrieval to stable Metacritic stats endpoints for more accurate meta and user scores.

![CriticDeck preview](https://images.steamusercontent.com/ugc/12628921612687895720/62D2DA8FF0F13E28B5B3A24B200BE3236D316D35/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false)

<a href='https://ko-fi.com/U6U516PSAI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi5.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Overview

CriticDeck is a Decky Loader plugin that patches Steam library routes and overlays each game page with a Metacritic critic score badge. The plugin fetches score data through Metacritic backend endpoints and links directly to each game's review page for full critic breakdown details.

## Highlights

- Injects a Metacritic score badge into Steam Deck library app/detail pages.
- Opens the game's Metacritic page directly from the badge.
- Uses a backend proxy flow to fetch score data without requiring manual API setup.
- Includes v1.0.1 score accuracy fixes for title matching and user/critic score retrieval.
- Built specifically for Decky Loader + Gaming Mode UX.

## How It Works

1. **Route patching**
   - Frontend patches library app/detail routes and mounts the CriticDeck badge component.
2. **Score lookup**
   - Plugin backend requests Metacritic data endpoints for the focused app title.
3. **Result mapping**
   - Frontend maps response payloads into a score value + URL target.
4. **User action**
   - Tapping the badge opens the Metacritic review page.

## Installation

1. Download the latest ZIP release from the repository releases page.
2. Transfer the ZIP file to your Steam Deck.
3. Open Decky settings on Steam Deck.
4. Go to Developer.
5. Select Install Plugin from ZIP file.

## Usage

1. Open a game page in Steam Deck Gaming Mode.
2. Open Decky and ensure CriticDeck is enabled.
3. Return to the game page to see the CriticDeck badge.
4. Tap the badge to open the full Metacritic critic page.

<a href='https://ko-fi.com/U6U516PSAI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi5.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
