# Notes for Claude

Spark is a brain trainer for country capitals and flags, a Vue 3 + Quasar PWA built with Vite and
deployed to GitHub Pages at https://spark.mayfleet.com. See README.md for how it works. Mult
(https://github.com/andrew-markin/mult) is its sibling, solutions proven there are reused here.

## Workflow

- Commit straight to `main` in small commits split by meaning, with a short English subject in
  the style of the history ("Dataset updated", "Icon redrawn with ...") and no Co-Authored-By or
  other attribution.
- Before committing run `npm run lint`, `npm test` and `npm run build`. Look at visible changes in
  the browser, at a phone width and in both themes too.
- Push only when asked. After a push watch the Deploy workflow and check the site; an installed
  PWA picks a new version up on the second launch.
- Dependabot opens weekly pull requests with updates; the Deploy workflow checks them without
  deploying.
- `npm run dataset` refreshes the countries from GeoNames (the username is in `.env`) and the
  flags from the `flag-icons` package into `public/flags`. Look at the diff before committing.

## Periodic checks

At the start of a conversation, if a check below is due (its next date has passed, or its event
happened), remind the user of it in a line. Once it is done or the user puts it off, update the
dates here and commit.

| Check                                                                                                                                        | Last done  | Next                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------- |
| New iPhone and iPad screen sizes are in `SCREENS` of `plugins/ios-splash-screens.js`, otherwise the app launches with a white screen on them | 2026-11-11 | 2027-09-20, after Apple's September event |
| The dataset is refreshed with `npm run dataset`, capitals and populations change now and then                                                | 2026-11-10 | 2027-11-10                                |

## Decisions to keep

- Training weights in `src/trainer.js` were tuned by a simulated learner, the same simulation is a
  test in `src/trainer.test.js`. Rerun it after changing them: rechecks growing slower or asked
  more often before they are due crowd out new countries as more is learned.
- Flags are plain files in `public/flags`, precached by the service worker with the app, so all
  of them are there offline after the first visit. Don't turn them back into components or
  load them from elsewhere.
- `plugins/purge-css.js` keeps the stylesheet names, and the service worker checks stylesheets by
  content (`dontCacheBustURLsMatching` in `vite.config.js`). Renaming purged stylesheets would
  change the scripts referring to them without changing their names, so the service worker
  would keep stale ones. Classes Quasar puts together at runtime, like
  `q-radio__inner--${state}` or `${vertical ? 'items' : 'justify'}-${align}`, are kept by the
  plugin automatically. A missed one breaks the layout quietly (the logo bolt moved off center
  once, `justify-center` was dropped), so after Quasar updates compare the computed styles of
  every element on every screen, in both themes, between `npm run dev` and `npm run preview`,
  not only by eye.
- The page background is set on `html` in `index.html`, from the theme saved in the settings
  before the app loads and from Quasar afterwards (`main.js`). `color-scheme` follows the theme as
  well: a `light dark` meta tag makes the default text white on the light theme of a dark system.
- The icon bolt takes 74% of the tile height in `favicon.svg`, which looked balanced, and 60% in
  the maskable icon, to stay inside the circle Android may cut it to. Sources are in `graphics/`.
  PNG icons are rendered from the SVGs by headless Chrome, a page showing the SVG at the size
  needed is captured with a transparent background:

  ```bash
  google-chrome --headless=new --default-background-color=00000000 --window-size=512,512 --screenshot=icon-512.png page.html
  ```

- The version has two numbers, like 1.0, raised as 1.1, 1.2 and so on, or 2.0 for a big change.
  `package.json` keeps a third one at zero for npm (`npm version 1.1.0 --no-git-tag-version`),
  and `vite.config.js` passes the first two to the app.
- Button texts are trimmed to their capitals and baseline (`text-box` in `CardButton.vue` and
  `CourseButton.vue`) and centered as such. Line boxes take their spacing from the font metrics
  rounded to device pixels, so at scales like 125% (GNOME large text) the letters sat a pixel or
  two high. Check such things by the pixels at real scales (`--force-device-scale-factor`), the
  scale emulated through DevTools rounds differently.
