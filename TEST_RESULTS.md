# V1.1 actual verification — 2026-09-22

12 groups passed in local offline Chromium 151.0.7922.34: eight existing card-workbench groups rerun on this candidate, plus four new race/schema regressions. Syntax check passed. No configured linter or type checker; not run.

Before the fix, a synthetic delayed first File.text read was observed to overwrite a second, already loaded draft. Baseline evidence was recorded separately without changing original files. V1.1 prevents the older read from committing. The new tests also change text or reset while reading and verify those changes survive, reject unsupported extensions/oversized files/array or primitive values/invalid template types, and confirm a valid file still loads afterwards. The overlapping file selection is synthetic; the visible load button is disabled while a read is pending.

Existing regression groups cover all six templates with edited Chinese/numbers/punctuation and actual PNG downloads; byte-for-byte equality with canvas preview; literal code-like input not executed; long-content overflow and automatic height; font/line-spacing changes and 9:16 export; empty fields; cancelled replacement; saved draft roundtrip and malformed draft rejection; offline zero application HTTP requests or runtime errors.

Desktop and 390px screenshots were visually inspected. Narrow layout was checked for page overflow. No UI redesign, new renderer or six-template scope expansion occurred. The fix is in an isolated copy; old tools remain untouched. Existing valid version-1 drafts retain their shape.

Method: baseline reproduction, targeted regression, existing browser suite and same-agent source/visual inspection. No independent cross-model review. All fixtures are fictional. No paid API, customer data, telemetry or dependency installation used.

Not verified: Android/iOS hardware, installed user Edge/Chrome versions, Safari/Firefox, browser crash recovery, system power loss, malicious browser extensions, actual recipient use or commercial outcomes. Browser downloads still require users to confirm files were saved. No absolute safety claim.
