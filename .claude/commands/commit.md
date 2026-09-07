# commit

Generate a commit message based on the current staged changes.

## Prerequisites

Read the git-workflow skill at `.claude/skills/git-workflow/SKILL.md` for commit format and conventions.

## Critical Rules

- **DO NOT commit unless explicitly asked** — only run `git commit` when the user specifically requests it
- **If asked to commit — do it only ONCE** — never retry or repeat commit attempts

## Instructions

1. **Get staged changes:**

   ```bash
   git diff --staged --stat
   git diff --staged
   ```

2. **Analyze and determine:**

   - A concise, imperative description of the change (lowercase, under 72 chars, no trailing period)

3. **Generate the commit command:**
   ```bash
   git commit -m "<description>"
   ```

## Output

1. **Suggested commit message** in the exact format
2. **Commit command** ready to copy
3. **Alternative suggestions** if the change could be categorized differently

## Notes

- If changes span multiple concerns, suggest splitting into multiple commits
- Follow push policy from the skill: never push unless explicitly asked
