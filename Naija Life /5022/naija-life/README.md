# A Day in the Life of a Nigerian 🇳🇬

A static, client-side life simulation. No backend, no build step, no accounts.
Open `index.html` in a browser, or upload this folder to GitHub Pages, Netlify, Vercel or Render Static Sites.

Progress is saved in the browser (localStorage). Use Me → Export JSON to back up a save.

## Structure

```
index.html            page shell, loads the scripts below in order
css/style.css         all styling (dark/light themes, responsive, mobile bottom nav)
js/
  01-core-utils-audio.js        helpers, ₦ formatting, sound effects
  02-base-data.js               base data: jobs, businesses, properties, assets, politics, titles, achievements
  03-economy-simulation.js      game state, macro economy, markets, daily simulation, news and events
  04-base-ui-panels.js          base panels (bank, markets, business, property, politics, profile) and render
  05-base-actions-boot.js       base actions (banking, trading, save/load/export/import) and boot
  10-time-jobs-skills.js        hour-by-hour clock, job market, interviews, skills, hustles, education, shop, travel
  20-state-world.js             36 states + FCT: cities, titles, weather, local news, state universities, politics
  30-npcs-phone-age.js          ageing, family, NPC network, phone, reputation, NYSC, hobbies
  40-memory-history-world.js    NPC memory, life history, statistics, awards, Hall of Fame, evolving world
  50-universities.js            university database (IMSU, ABSU, UNN, UNIZIK ...), priority order, search, compare
  60-profile-education-traits.js  four-field profile, earned primary/secondary/SSCE, trait effects
  70-relationships.js           dating, engagement, marriage, household, spouse life
```

## Important: load order matters

The files are classic scripts that share one global scope and are loaded in the order listed.
Later files **extend** earlier ones by wrapping or replacing functions
(for example `render`, `newDay`, `endDay`, `pMe`, `INST`, `fxn`).
Do not reorder the `<script>` tags in `index.html`.

## Adding content

- New state data: `STD` and `LOC` in `20-state-world.js`
- New jobs: the job table at the top of `10-time-jobs-skills.js`
- New universities: `MJ` in `50-universities.js`
- Relationship age limits: `DATING_MIN_AGE`, `ENGAGEMENT_MIN_AGE`, `MARRIAGE_MIN_AGE` in `70-relationships.js`

## Notes

- Banks, companies, parties and people are fictional. Nothing connects to real services.
- Donations: BNB Smart Chain address is on the Credits page (copy only, no wallet connection).
- Created by Charles Afamefune Ezeyisi, charlesafamefune@gmail.com
