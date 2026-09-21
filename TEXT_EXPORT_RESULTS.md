# V1.3 text export verification

Final actual desktop Chromium151.0.7922.34 run: five groups PASS. Six template TXT downloads exactly match field labels, order, values, empty fields, Chinese/digits/markup literals and multiline bodies. PNG preview bytes unchanged by text export. Overflow text remains complete; >1MiB rejected without deleting input or requesting a download. Dirty state and native beforeunload remain after TXT export; cancellation keeps the edit. Offline390px layout has no page overflow, external HTTP requests or page errors. Same-agent screenshot review found button and explanatory text readable.

Unchanged PNG renderer/full original suites not rerun. No physical phone, Safari/Firefox or independent-model review. Fixtures are fictional. Publication checked separately after upload.

Initial browser test failed on the comparison template because its single-line title inputs normalized test newlines to spaces. The export reflected actual input values, not a renderer defect. Test fixtures were corrected to use single-line titles and retain multiline body fields. No product change was made for this failure. Final rerun result is recorded separately below when completed.

Second run reached the canceled beforeunload check but Playwright waited for a load that intentionally never occurred, then timed out. The harness now accepts a canceled-navigation timeout only after actually observing and dismissing the native beforeunload dialog, then asserts the original edit remains. This is a test-harness correction, not a product fix.

Plain TXT does not preserve layout and cannot be imported as an editable project. It deliberately keeps the unsaved-edit reminder. Output may contain private data entered by the user; no automatic privacy detection is provided.
