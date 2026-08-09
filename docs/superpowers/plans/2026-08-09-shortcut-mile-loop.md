# Shortcut Mile Loop Implementation Plan

**Goal:** Turn the PWA into a closed-loop Y!mobile mileage workflow: record starting miles, run the daily eligible-service visit loop through an iPhone Shortcut, return to the PWA, and record ending miles/difference.

**Architecture:** Keep the site static on GitHub Pages. The site owns the current eligible URL list and passes it as newline-delimited text to a user-created Shortcut via Apple's `shortcuts://x-callback-url/run-shortcut` scheme. The Shortcut loops through the URLs in Safari and returns to the site; the site stores only local visit/session state and manually entered mile balances, never claiming server-side award confirmation from a page visit alone. Use browser display mode so the Home Screen link and callback stay in Safari's storage context.

**Verification:** 30 Node tests pass; JavaScript syntax checks pass; core static files return HTTP 200 under a local server.
