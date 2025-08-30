
# Paper.io Mobile Mod Pack (for stevenjoezhang/paper.io)

This mod pack adds mobile optimizations (DPR-aware canvas, RAF loop, swipe controls) and a 30-second ad-based revive option (with 1 revive per game) to the original repository.

## What this contains
- public/ui.css: Minimal overlay UI styles (HUD, Game Over, Ad modal)
- public/ui.html: Overlay markup (HUD, Game Over buttons, Ad modal)
- client/mobile_opt.js: Canvas scaling + touch/swipe input + small perf helpers
- client/revive_ads.js: Revive flow with 30s ad countdown fallback and IMA hook
- test-client/: A standalone minimal demo to verify the overlay + revive flow

## Integration Steps (non-destructive)
1) Add viewport meta to your main HTML (e.g., public/index.html):
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

2) Inject overlay UI (copy the content of public/ui.html) into the body of your page so it sits above the game canvas. Ensure the canvas has id="game" or update selectors in client/mobile_opt.js to your canvas id.

3) Include CSS and scripts (near the end of </body>):
   <link rel="stylesheet" href="/public/ui.css">
   <script src="/client/mobile_opt.js"></script>
   <script src="/client/revive_ads.js"></script>

4) Hook death/respawn in your game engine:
   - When the player dies, call: window.PaperRevive.onDeath(lastSafeState?)
   - To respawn after ad, implement window.PaperRevive.onRespawn(cb) to call your engine function that places the player at last safe position and resumes the loop.
   - If your engine already tracks a safe position (e.g., when inside territory), pass it to onDeath. Otherwise, the reviver will use the last known position it captured while inside territory.

   Example glue code inside your game logic:
   // when detecting death
   if (dead) {
     const safe = { x: player.safeX, y: player.safeY, dir: {...player.safeDir} };
     window.PaperRevive.onDeath(safe);
   }

   // provide a respawn handler once at init
   window.PaperRevive.onRespawn(() => {
     engine.respawnAt(window.PaperRevive.getLastSafe());
     engine.resume();
   });

5) Config (optional): In your config.js add fields:
   reviveEnabled: true,
   reviveLimit: 1,
   adSeconds: 30

6) Build & Run:
   npm install
   npm run build
   npm start (or your dev server)

7) Ads (production): Replace the fallback countdown with Google IMA HTML5 rewarded ad integration in client/revive_ads.js (see TODO in file). Ensure your ad unit supports rewarded and follows IMA/Ad Manager guidelines.

## Notes
- The mod minimizes extra DOM work and uses passive event listeners for touch to reduce scroll/gesture jank on mobile.
- The revive limit is one per session by default; adjust in revive_ads.js if needed.
- The test-client folder can be opened with any static server (e.g., npx serve test-client) to verify the UX.
