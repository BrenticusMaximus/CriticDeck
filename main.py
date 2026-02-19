import asyncio
import json
import re
import ssl
import time
import unicodedata
import urllib.parse
import urllib.request
from difflib import SequenceMatcher
from typing import Any, Dict, List, Optional

import decky_plugin
from settings import SettingsManager


SEARCH_ENDPOINT = (
    "https://backend.metacritic.com/finder/metacritic/search/{query}/web"
    "?offset=0&limit=50&mcoTypeId=13"
)
SCORES_ENDPOINT = (
    "https://backend.metacritic.com/games/metacritic/{slug}/web"
    "?componentName=scores&componentDisplayName=Scores&componentType=ScoreSummary"
)
USER_AGENT = "CriticDeck/0.1 (+https://github.com/chrismichaelps/metacritic)"
CACHE_TTL_SECONDS = 60 * 60 * 6  # 6 hours


def _normalize_text(value: str) -> str:
    if not value:
        return ""
    stripped = (
        unicodedata.normalize("NFKD", value)
        .encode("ascii", "ignore")
        .decode("ascii")
        .lower()
    )
    stripped = re.sub(r"[^a-z0-9]+", " ", stripped)
    return re.sub(r"\s+", " ", stripped).strip()


class MetacriticClient:
    def __init__(self) -> None:
        self._ssl_context = ssl.create_default_context()
        self._cache: Dict[str, Dict[str, Any]] = {}

    def lookup(self, title: str, platform: str = "PC") -> Dict[str, Any]:
        key = f"{title}|{platform}".lower()
        now = time.time()
        cached = self._cache.get(key)
        if cached and now - cached["timestamp"] < CACHE_TTL_SECONDS:
            return cached["data"]

        data = self._fetch_score(title, platform)
        if data.get("found"):
            self._cache[key] = {"timestamp": now, "data": data}
        return data

    def _fetch_score(self, title: str, platform: str) -> Dict[str, Any]:
        if not title:
            return {"found": False, "error": "Missing title"}

        query = urllib.parse.quote(title)
        search_url = SEARCH_ENDPOINT.format(query=query)
        search_payload = self._request_json(search_url)
        items: List[Dict[str, Any]] = search_payload.get("data", {}).get("items", [])

        match = self._pick_best_match(items, title, platform)
        if not match:
            return {"found": False, "error": "No Metacritic entry found"}

        slug = match.get("slug")
        if not slug:
            return {"found": False, "error": "Result missing slug"}

        detail_url = SCORES_ENDPOINT.format(slug=slug)
        detail_payload = self._request_json(detail_url)
        item = detail_payload.get("data", {}).get("item", {})
        if not item:
            return {"found": False, "error": "Unable to load score details"}

        platform_entry = self._find_platform_entry(
            item.get("platforms", []), platform
        )
        critic_summary = (
            platform_entry.get("criticScoreSummary")
            if platform_entry
            else item.get("criticScoreSummary")
        ) or {}

        release_date = (
            platform_entry.get("releaseDate")
            if platform_entry
            else item.get("releaseDate")
        )

        metacritic_url = critic_summary.get("url")
        if metacritic_url:
            if not metacritic_url.startswith("http"):
                metacritic_url = f"https://www.metacritic.com{metacritic_url}"
        else:
            metacritic_url = None

        result = {
            "found": True,
            "title": item.get("title"),
            "matched_title": match.get("title"),
            "slug": slug,
            "platform": platform_entry.get("name")
            if platform_entry
            else item.get("platform")
            or platform,
            "platforms": [p.get("name") for p in item.get("platforms", []) if p.get("name")],
            "score": critic_summary.get("score"),
            "score_max": critic_summary.get("max"),
            "sentiment": critic_summary.get("sentiment"),
            "release_date": release_date,
            "description": item.get("description"),
            "metacritic_url": metacritic_url,
        }
        return result

    def _request_json(self, url: str) -> Dict[str, Any]:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, context=self._ssl_context, timeout=15) as res:
            payload = res.read()
            return json.loads(payload)

    def _pick_best_match(
        self, items: List[Dict[str, Any]], target_title: str, platform: str
    ) -> Optional[Dict[str, Any]]:
        normalized_target = _normalize_text(target_title)
        normalized_platform = _normalize_text(platform or "")

        best_item: Optional[Dict[str, Any]] = None
        best_score = 0.0
        for item in items:
            if item.get("type") != "game-title":
                continue
            current_title = item.get("title") or ""
            normalized_title = _normalize_text(current_title)
            if not normalized_title:
                continue
            similarity = SequenceMatcher(
                None, normalized_target, normalized_title
            ).ratio()
            if (
                normalized_target
                and normalized_title
                and normalized_target in normalized_title
            ):
                similarity += 0.25
            if (
                normalized_title
                and normalized_target
                and normalized_title.startswith(normalized_target[:6])
            ):
                similarity += 0.1

            platform_names = [
                _normalize_text(p.get("name", "")) for p in item.get("platforms", [])
            ]
            if normalized_platform and normalized_platform in platform_names:
                similarity += 0.2

            critic_summary = item.get("criticScoreSummary")
            if critic_summary and critic_summary.get("score"):
                similarity += 0.05

            if similarity > best_score:
                best_score = similarity
                best_item = item

        return best_item

    def _find_platform_entry(
        self, platforms: List[Dict[str, Any]], platform: str
    ) -> Optional[Dict[str, Any]]:
        if not platforms or not platform:
            return None
        normalized_target = _normalize_text(platform)
        for entry in platforms:
            name = entry.get("name")
            if name and _normalize_text(name) == normalized_target:
                return entry
        # fallback to first entry
        return platforms[0] if platforms else None


class Plugin:
    def __init__(self) -> None:
        self.settings: Optional[SettingsManager] = None
        self._metacritic = MetacriticClient()

    async def _main(self) -> None:
        self.settings = SettingsManager(
            name="config", settings_directory=decky_plugin.DECKY_PLUGIN_SETTINGS_DIR
        )

    async def _unload(self) -> None:
        pass

    async def set_setting(self, key: str, value: Any) -> None:
        if not self.settings:
            return
        self.settings.setSetting(key, value)

    async def get_setting(self, key: str, default: Any = None) -> Any:
        if not self.settings:
            return default
        return self.settings.getSetting(key, default)

    async def get_metacritic_score(self, title: str, platform: str = "PC") -> Dict[str, Any]:
        loop = asyncio.get_running_loop()
        try:
            result = await loop.run_in_executor(
                None, self._metacritic.lookup, title, platform
            )
            return result
        except Exception as err:  # pragma: no cover - defensive logging
            decky_plugin.logger.error(f"Metacritic lookup failed: {err}")
            return {"found": False, "error": "Lookup failed"}
