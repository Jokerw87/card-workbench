# V1.1 actual verification — 2026-09-22

12 groups passed in local offline Chromium 151.0.7922.34: eight existing card-workbench groups rerun on this candidate, plus four new race/schema regressions. Syntax check passed. No configured linter or type checker; not run.

Before the fix, a synthetic delayed first File.text read was observed to overwrite a second, already loaded draft. Baseline evidence was recorded separately without changing original files. V1.1 prevents the older read from committing. The new tests also change text or reset while reading and verify those changes survive, reject unsupported extensions/oversized files/array or primitive values/invalid template types, and confirm a valid file still loads afterwards. The overlapping file selection is synthetic; the visible load button is disabled while a read is pending.

Existing regression groups cover all six templates with edited Chinese/numbers/punctuation and actual PNG downloads; byte-for-byte equality with canvas preview; literal code-like input not executed; long-content overflow and automatic height; font/line-spacing changes and 9:16 export; empty fields; cancelled replacement; saved draft roundtrip and malformed draft rejection; offline zero application HTTP requests or runtime errors.

Desktop and 390px screenshots were visually inspected. Narrow layout was checked for page overflow. No UI redesign, new renderer or six-template scope expansion occurred. The fix is in an isolated copy; old tools remain untouched. Existing valid version-1 drafts retain their shape.

Method: baseline reproduction, targeted regression, existing browser suite and same-agent source/visual inspection. No independent cross-model review. All fixtures are fictional. No paid API, customer data, telemetry or dependency installation used.

Not verified: Android/iOS hardware, installed user Edge/Chrome versions, Safari/Firefox, browser crash recovery, system power loss, malicious browser extensions, actual recipient use or commercial outcomes. Browser downloads still require users to confirm files were saved. No absolute safety claim.
# V1.2 targeted contrast checks — 2026-09-22

Six groups PASS: known mathematical ratios and unrounded thresholds; immediate low-contrast warning without export blocking; reset refresh and pixel preservation; existing JSON schema roundtrip and import refresh; low-contrast PNG export; whole default canvas PNG byte equality with V1.1. Chromium 151.0.7922.34, offline browser context.

Desktop 1360px and narrow 390px screenshots of the warning area visually inspected: text wraps, actions remain separate, document width equals viewport width. This is not mobile hardware, screenreader, physical printing or complete WCAG validation. Prior unchanged rendering/race tests below are inherited evidence, not rerun. V1.2 publication pending at test checkpoint.
