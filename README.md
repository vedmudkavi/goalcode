# GoalCode

GoalCode is an interactive football match-intelligence platform that turns real match data into clear visual stories. Search a match, inspect the verified starting XIs, replay every goal step by step, compare territory and pressing, and explore how each team changed shape.

**Live demo:** [goalcode-football-lab.vedsantosh4948.chatgpt.site](https://goalcode-football-lab.vedsantosh4948.chatgpt.site)

![GoalCode match library](public/screenshots/goalcode-home.png)

## What you can explore

- Searchable match library with season and competition filters
- Real scorelines, lineups, scorers and team statistics
- Five-step animated goal journeys with a visible ball path and goal celebration
- Separate team territory maps for possession, touches, xT, progression and pressing
- First-half and second-half attacking directions
- Interactive formation evolution
- Clickable player profiles and collectible performance cards
- Responsive mobile layout
- Match-specific source attribution

## Included matches

### Arsenal 2–2 Liverpool — 27 October 2024

A four-goal Premier League report featuring Saka, Van Dijk, Merino and Salah.

### Hull City 2–0 Manchester United — 22 August 2026

Hull City's opening-day Premier League win, featuring goals from Semi Ajayi and Nobel Mendy.

![Hull City vs Manchester United report](public/screenshots/goalcode-hull-report.png)

## Data sources

GoalCode combines public match records from:

- [Opta Analyst](https://theanalyst.com/articles/hull-city-vs-manchester-united-stats-premier-league-08-2026)
- [StatMuse Football](https://www.statmuse.com/fc/match/8-22-2026-hul-vs-mun-112764)
- [Premier League player registry and assets](https://www.premierleague.com/)
- Public match reports used to verify goal sequences

Exact match facts are treated as verified data. Tactical shapes, territory intensity and drawn goal paths are clearly presented as event-based visual reconstructions when full tracking coordinates are not publicly available.

## Technology

- React
- TypeScript
- Vinext / Vite
- CSS animations and responsive layouts
- OpenAI Sites deployment

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Production build

```bash
npm run build
```

## Project direction

The next stage is to connect a broader football data API so GoalCode can load seasons and matches dynamically instead of bundling each report. The interface is already structured around a reusable match library and match-specific data sources.

---

Built as a football analytics and product-design portfolio project.
