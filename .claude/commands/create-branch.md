# create-branch

Create a new Git branch following the project's naming conventions.

## Prerequisites

Read the git-workflow skill at `.claude/skills/git-workflow/SKILL.md` for branch naming conventions.

## Input Parameters

- **Description**: {{description}} — what the branch is for (e.g. "task due dates")
- **Type**: {{type}} — one of `feat`, `fix`, `refactor`, `test`, `chore`, `docs`

## Instructions

1. Branch off the latest `main`
2. Name the branch `<type>/<short-description>` in lowercase kebab-case (e.g. `feat/task-due-dates`)
3. Infer the type from the description when it's obvious; otherwise ask the user
4. If no description is provided, ask the user

## Command

```bash
git switch main && git pull
git switch -c <generated-branch-name>
```

## Output

Confirm:

- Branch name created
- Current branch status
- Ready for development
