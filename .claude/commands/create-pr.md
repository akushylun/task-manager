# create-pr

Create a GitHub Pull Request with a concise, file-specific description.

## Prerequisites

Read the git-workflow skill at `.claude/skills/git-workflow/SKILL.md` for PR title format and description conventions.

## Branch model

- Feature branches are cut from **`main`**.
- PRs are opened against **`main`** — there is no separate integration branch.

## Instructions

1. **Identify the branch:**

   ```bash
   git branch --show-current
   ```

2. **Analyze the branch's changes against `main`** (the branch point):

   ```bash
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```

3. **Draft the PR:**

   - Write concise, file-specific bullet points
   - Compute the Logic/Tests change stats

4. **Push and create the PR against `main`:**

   ```bash
   git push -u origin HEAD
   gh pr create --base main --title "<description>" --body "$(cat <<'EOF'
   ## What was done

   - <bullet points>
   EOF
   )"
   ```

   Prefer the GitHub MCP tools if available; fall back to the `gh` CLI as shown.

## Output

1. **PR title** in the exact format
2. **PR description** with concise bullet points
3. **Ready-to-run command** to create the PR
4. **PR URL** after creation

## Notes

- Always push the branch before creating the PR
- If branch is already pushed, skip the push step
- Keep the description scannable — reviewers should understand changes in 10 seconds
