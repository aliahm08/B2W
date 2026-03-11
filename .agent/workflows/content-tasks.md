---
description: Automatically update CONTENT.md when website copy changes
---
# Content Update Rule

Whenever you complete a task that involves modifying the copy, text, or content of any website component (like Hero, Work, Industries, Team, or CTA), you MUST update `CONTENT.md` to reflect the latest changes.

This document serves as the master source of truth for the site's text and copy.
You do not need to ask for permission to update `CONTENT.md`; do this automatically before concluding the task.

**Rule Execution Steps:**
1. Wait until all code changes for the content update are finalized and approved.
2. Update `CONTENT.md` with the new copy.
3. Automatically commit the changes to version control using `git add` and `git commit` with a message that includes "Update content and Revision History".
4. Append an entry to the "Revision History" section at the bottom of `CONTENT.md` with the current date and summary of changes.
