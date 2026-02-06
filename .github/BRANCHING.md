# Git Branching Strategy

## Overview

This document outlines the Git branching strategy for this project. All team members must follow these conventions to maintain a clean, organized repository and ensure smooth collaboration.

## Branch Types

### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Rules**:
  - Must always be in a working, deployable state
  - No direct commits allowed
  - Merges only via pull requests with code review
  - Protected branch (enforcement recommended)

### Develop Branch (`develop`)
- **Purpose**: Integration branch for features and fixes
- **Rules**:
  - Must be stable and ready for testing
  - No direct commits allowed
  - Merges only via pull requests with code review
  - Base branch for pull requests targeting `main`

## Feature Branches

### Naming Convention: `feature/<description>`

**Format**: `feature/kebab-case-description`

**Examples**:
- `feature/user-authentication`
- `feature/dark-mode-toggle`
- `feature/payment-integration`

**Rules**:
- Created from: `develop`
- Merged back into: `develop`
- Deleted after merge

## Bug Fix Branches

### Naming Convention: `fix/<description>`

**Format**: `fix/kebab-case-description`

**Examples**:
- `fix/login-button-styling`
- `fix/api-timeout-issue`
- `fix/memory-leak-in-modal`

**Rules**:
- Created from: `develop` (for general bugs) or `main` (for critical production bugs)
- Merged back into: `develop` or `main`
- Deleted after merge

## Chore Branches

### Naming Convention: `chore/<description>`

**Format**: `chore/kebab-case-description`

**Examples**:
- `chore/update-dependencies`
- `chore/refactor-auth-module`
- `chore/add-ci-pipeline`

**Rules**:
- Created from: `develop`
- Merged back into: `develop`
- Deleted after merge

## Workflow

### Creating a New Feature/Fix/Chore

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create a new branch
git checkout -b feature/your-feature-name

# Make commits
git add .
git commit -m "description of changes"

# Push to remote
git push origin feature/your-feature-name
```

### Pull Request Process

1. **Before submitting PR**:
   - Ensure all tests pass locally
   - Run ESLint and Prettier locally
   - Rebase on latest `develop` (or `main` if hotfix)
   - Write clear commit messages

2. **Create PR**:
   - Title: Clear, descriptive title (e.g., "Add user authentication")
   - Description: Use the PR template (see `.github/PULL_REQUEST_TEMPLATE.md`)
   - Reviewers: Add at least 2 team members

3. **Code Review**:
   - Address all feedback from reviewers
   - Update PR with requested changes
   - Request re-review after updates

4. **Merge**:
   - Requires approval from at least 2 reviewers
   - All checks must pass (ESLint, tests, CI/CD)
   - Use "Squash and merge" for cleaner history
   - Delete the branch after merge

### Main Branch Releases

- **Hotfixes** (critical bugs in production):
  - Create `fix/` branch from `main`
  - Create PR targeting `main`
  - After merge to `main`, create PR to merge back into `develop`

- **Regular releases**:
  - All features merged to `develop`
  - Create `release/` branch from `develop`
  - Create PR from `release/` to `main`
  - After merge, tag release on `main`

## Commit Message Guidelines

Follow Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, CI/CD, dependencies

**Example**:
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for enhanced security.
Add backup codes for account recovery.

Closes #123
```

## Best Practices

1. **Keep branches short-lived**: Target 1-3 days maximum
2. **Keep commits atomic**: One logical change per commit
3. **Write clear commit messages**: Explain the "why", not just the "what"
4. **Review before pushing**: Self-review your changes first
5. **Keep PR scope focused**: Avoid combining multiple unrelated changes
6. **Communicate with team**: Use GitHub discussions for questions
7. **Rebase before merging**: Keep a linear history when possible

## Reverting Changes

If a merged PR causes issues:

1. Create a new `fix/` branch
2. Revert the problematic commit(s)
3. Create a PR with a clear description
4. Get approval and merge

**Avoid**:
- Force pushing to `main` or `develop`
- Directly editing the history

## Questions?

Please reach out to the team lead or create an issue if you have questions about this branching strategy.
