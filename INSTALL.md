# CHB v0.5.5 — Work UX Improvements

Copy the complete contents of this package into the root of the `my-dashboard` repository and allow existing files to be replaced.

## Included changes

- Every newly created work session starts at the current local hour and minute.
- The default session end is two minutes after the start, including midnight rollover.
- Dashboard quick entry refreshes the suggested times whenever the panel is opened and after a session is added.
- The Work-day session editor uses the same shared default-time calculation.
- Message-rate progress shows missing messages and the percentage of the next threshold still remaining.
- AI Project Interface source data and generated documentation are updated for v0.5.5.

## Verification

Run:

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

## Functional tests

1. Open Dashboard quick entry at a known time, for example 15:00. The suggested block should be 15:00–15:02.
2. Close the panel, wait for the minute to change, and reopen it. The suggested times should refresh.
3. Add a block. The next suggested block should refresh to the current time plus two minutes.
4. On the Work page open any day's session editor and click `Dodaj blok`. It should use current time plus two minutes.
5. Verify midnight rollover: a block created at 23:59 should default to 23:59–00:01.
6. Verify threshold messages, for example 180 paid messages: 596 messages remain to 776, which displays as 76.8% remaining with the Polish decimal separator.
7. Verify the same calculation for thresholds 1,576 and 1,976.
8. Verify the highest threshold still displays the completed state.
