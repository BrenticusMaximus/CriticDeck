# Metacritic matching, platform resolution, and score fallbacks

CriticDeck talks to Metacritic's unofficial backend API (the same one documented at
[chrismichaelps/metacritic](https://github.com/chrismichaelps/metacritic)), not an official,
versioned API. That API has real gaps and quirks - particularly around per-platform data - that
directly shape what the badge shows and why. This document explains the logic in
[`src/hooks/useMetacriticScore.ts`](../src/hooks/useMetacriticScore.ts) so the "why" behind a
given badge doesn't have to be re-derived from scratch next time something looks wrong.

## 1. Title matching

CriticDeck searches Metacritic by the game's display title (`SEARCH_ENDPOINT`) and picks the
best match from the results with `pickBestMatch`. Matching is a weighted heuristic, not an exact
lookup - it favors an exact normalized title match, then a prefix/substring match, then token
overlap, with a small bonus if the candidate lists the preferred platform. This is necessary
because Steam's title and Metacritic's title for the same game are often not byte-identical
(punctuation, subtitles, edition suffixes, regional naming).

## 2. Platform resolution

Once a title is matched, CriticDeck resolves **one specific platform's data** to show, via
`resolvePlatformEntry(detail, platform)` - normally `platform = 'PC'`. This is the single most
important concept in this file, because the rest of the badge's behavior depends on whether that
resolved platform:

- **doesn't exist at all** for this title (e.g. a Nintendo Switch exclusive) - the code falls
  back to `detail.criticScoreSummary`, i.e. whatever Metacritic considers the title's overall/
  default data. This avoids showing nothing just because the title isn't on the preferred
  platform.
- **exists, but has no Metascore for it** - this is the more surprising case, covered in detail
  below.
- **exists and has full critic data** - the common, "everything works" case.

```js
const platformEntry = resolvePlatformEntry(detail, platform)
const criticSummary = platformEntry?.criticScoreSummary ?? detail.criticScoreSummary
```

## 3. Meta Critic (critic score)

Metacritic's scores endpoint (`SCORES_ENDPOINT`) returns a `criticScoreSummary` **per platform**,
each with its own `score`, `max`, `sentiment`, `reviewCount`, and a positive/mixed/negative
breakdown. Critically, **Metacritic will not calculate a Metascore for a platform until that
platform has enough critic reviews of its own** - a handful of reviews isn't enough, even if the
same title has dozens of reviews on another platform.

This produces real, confirmed cases like:

| Title | PC critic reviews | PC Metascore | Lead platform (e.g. PS5) reviews | Lead platform Metascore |
|---|---|---|---|---|
| Sonic X Shadow Generations | 3 | `null` (TBD) | 78-80 | 80 |
| Sleeping Dogs: Definitive Edition | 0 | `null` (TBD) | 34 (PS4) | 77 |

So "TBD" on PC for a game that clearly "has a score" on Metacritic's own site is usually correct,
not a bug - it reflects that *PC specifically* doesn't have enough critic coverage yet, even
though another platform does.

**Past bug, now fixed:** the critic review *count* shown in the badge used to come from a
separate, platform-blind stats endpoint (`CRITIC_STATS_ENDPOINT`) that always returns the title's
lead platform's count, no matter which platform the score itself was resolved to. That produced
badges showing e.g. "78 reviews" next to a "TBD" PC score - two different platforms' data shown
side by side as if they were one. The fix was to stop calling that separate endpoint and instead
read `reviewCount`/the breakdown directly off the already platform-resolved `criticSummary`
(`src/hooks/useMetacriticScore.ts`, around the `criticSummary?.reviewCount` usage) - that data was
already being fetched, per-platform, by the scores endpoint; the extra request was both redundant
and wrong.

## 4. User Critic (user score)

User score comes from a different endpoint (`USER_STATS_ENDPOINT`) that has **no platform
filtering capability at all**. This was verified directly against the live API: passing
`?platform=pc`, `?platformId=<id>`, or even a path-based platform segment all had zero effect -
the endpoint always returns the title's lead/default platform's user score and review count,
regardless of what's requested. There is no known way to get a platform-specific user score from
this API.

Because of that hard limitation, CriticDeck discloses the mismatch instead of silently presenting
another platform's user score as if it belonged to the resolved one. `user_score_platform` is set
to the lead platform's name (`detail.platform`), and the badge shows that platform's name on its
own line under the review count whenever it differs from the resolved platform
(`userScorePlatformNote` in `src/components/MetacriticBadge/index.tsx`). This is a transparency
measure, not a fix - there isn't one available client-side.

## 5. Sentiment and the status text fallback chain

The small status line under the title/date (e.g. "Generally favorable") follows this priority,
implemented in `MetacriticBadge`'s `label` computation:

1. **`data.sentiment`**, translated via `translateSentiment` - normally comes from the resolved
   platform's `criticScoreSummary.sentiment`.
2. If the resolved platform has no sentiment of its own (the "enough reviews elsewhere, not
   enough on PC" case from section 3), **fall back to the lead platform's sentiment**
   (`detail.criticScoreSummary?.sentiment`) instead of a generic placeholder. A real sentiment
   from the title's dominant platform is a much better signal than no context at all.
3. If the title wasn't found on Metacritic at all (`data.found === false`): **"No score yet"**.
4. If the title was found, a Metascore exists (`typeof data.score === 'number'`), but somehow has
   no sentiment: **"Metascore"** (a rare edge case - Metacritic normally pairs a score with a
   sentiment).
5. Otherwise - the title was found, but *no platform at all* has enough critic reviews for a
   sentiment (e.g. Teslagrad Remastered, where every platform has 0-2 reviews): **"Not Enough
   Reviews"**. This is the case step 2's fallback can't help with, since there's genuinely nothing
   to fall back to.

That last case used to also show the generic "Metascore" text, which read as if a score existed
when it didn't - "Not Enough Reviews" was chosen specifically to describe *why* the badge has
nothing better to show, rather than leaving the user to guess.

## Summary: why a badge might look "incomplete"

| Symptom | Cause |
|---|---|
| Metascore shows "TBD" | Resolved platform (PC) has too few critic reviews for its own Metascore. |
| Review count on the critic chip is much higher than expected given "TBD" | Fixed - this count now always matches the platform the score belongs to. |
| Status text says "Not Enough Reviews" | No platform at all has enough critic reviews yet for any sentiment. |
| Status text shows a real sentiment despite "TBD" | Working as intended - borrowed from the title's dominant platform. |
| User score chip shows another platform's name underneath | The user-score API has no per-platform data; this discloses whose score is actually shown. |
| Platform shows as something other than PC entirely | The title isn't released on the preferred platform at all; the badge fell back to Metacritic's own default/lead platform for that title. |
