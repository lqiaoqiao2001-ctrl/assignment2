# TimeCheck

README prose word count: 334

## Project status

TimeCheck compares three policies for setting a student reminder from a short English request. A rule-based parser identifies a task, day and one or two candidate times. The browser implements clarification, confirmation, cancellation, correction and one-step undo. The reminder is simulated in a single page session. It clears on reload. Real scheduling and notifications are planned.

## Run or replay

Open `index.html` in Edge, Chrome or Firefox. The demo uses 16 November 2026 and Asia/Shanghai. No installation, accounts, API keys or backend are required.

- **Clear request:** Keep the default policy, choose **Try 9 pm**, and submit. Check the displayed day and time. Select **Undo** to remove the reminder.
- **Ambiguous request:** Choose **Try “at nine”**, submit, and select **9:00 p.m.** The simulator waits for your choice.
- **Wrong default:** Choose **Set straight away** and submit **Try “at nine”**. Inspect the a.m. assumption and use **Change a.m. or p.m.** to correct it.
- **Compare:** In **Confirm every request**, submit the clear 9 pm example and confirm or cancel.

Run the parser and policy checks with Node.js from the repository directory.

```sh
node verify.cjs
```

## Technology

HTML and CSS render the interface. JavaScript parses requests, runs the selected policy and stores the active reminder and one undo snapshot in browser memory. A deterministic rule set stands in for AI interpretation.

## Development record

- Turned the Assignment 1 comparison into three replayable policies on one parser. Checked explicit times, ambiguous times, noon, midnight and invalid input.
- Kept ambiguous requests pending until the user chooses a time. Checked keyboard selection, cancellation and confirmation in Edge.
- Exposed the default assumption on the result and added a.m./p.m. correction. Checked that undo removes the first reminder or restores the previous one after an edit.

## AI assistance

OpenAI Codex helped build the prototype, draft the report and turn tested browser states into storyboards. Codex checked parser behaviour, keyboard focus, recovery, mobile width and the report counts.

## Additional files

The separately supplied Assignment 2 report contains the architecture diagram, three storyboards and references. No accompanying ZIP is needed.
