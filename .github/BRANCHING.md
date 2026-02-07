# Branch Management & Workflow Strategy

This document outlines the branching strategy and workflow conventions for the WEQN Next.js project. All team members must follow these guidelines to maintain code quality and repository organization.

## Branch Strategy Overview

The project follows a **modified Git Flow** branching model with three primary branch types:

### 1. Main Branches

#### `main`
- **Purpose**: Production-ready code only
- **Stability**: Fully tested, reviewed, and verified
- **When to use**: Merging from `develop` after thorough QA and testing
- **Protection**: Direct commits are **strictly forbidden**
- **Merge trigger**: Release-ready code from `develop` branch

#### `develop`
- **Purpose**: Active development and integration branch
- **Stability**: Should be in a working state; may contain features being tested
- **When to use**: Base branch for all feature and fix branches
- **Protection**: Direct commits are **discouraged**; use pull requests only
- **Merge trigger**: Completed features and bugfixes from supporting branches

### 2. Supporting Branches

All supporting branches are created from `develop` and must be merged back to `develop` via Pull Request.

#### `feature/<short-description>`
- **Purpose**: Development of new features or enhancements
- **Naming convention**: `feature/user-authentication`, `feature/queue-management`, `feature/dashboard`
- **When to create**: At the start of a new feature task
- **When to merge**: After completion, review, and testing
- **Lifetime**: Temporary; deleted after merge to `develop`

#### `fix/<short-description>`
- **Purpose**: Bug fixes and corrections for existing functionality
- **Naming convention**: `fix/authentication-timeout`, `fix/form-validation-error`
- **When to create**: When a bug is identified and needs immediate attention
- **When to merge**: After verification that the fix resolves the issue
- **Lifetime**: Temporary; deleted after merge to `develop`

#### `chore/<short-description>`
- **Purpose**: Non-feature work (dependencies, tooling, documentation, refactoring)
- **Naming convention**: `chore/update-dependencies`, `chore/improve-readme`, `chore/code-refactoring`
- **When to create**: For maintenance tasks that don't affect user-facing functionality
- **When to merge**: After review and testing completion
- **Lifetime**: Temporary; deleted after merge to `develop`

## Naming Conventions

- Use **lowercase** letters only
- Use **hyphens** to separate words (no spaces or underscores in descriptions)
- Keep descriptions **concise** (2-4 words max)
- Be **descriptive** about the work being done

### Good Examples:
```
feature/user-dashboard
feature/payment-integration
fix/database-connection-error
fix/ui-button-alignment
chore/update-typescript
chore/add-github-workflows
```

### Bad Examples:
```
feature/new-feature          (too vague)
feature_user_dashboard       (uses underscores)
Fix/bug                      (capitalized)
feature/add a new user login (spaces, too long)
```

## Branch Workflow Rules

### Creating a Branch

1. **Always branch from `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Keep branches focused**: One feature or fix per branch

3. **Sync with develop regularly**: Prevent merge conflicts
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

### Before Creating a Pull Request

- Ensure branch is up-to-date with `develop`
- Run linting: `npm run lint`
- Run tests: `npm run test`
- Verify no TypeScript errors: `npm run build`
- All checks must pass before submitting PR

### Merging Rules

#### To `develop` Branch:
- **Minimum reviewers**: 1 approved review required
- **Checks required**: 
  - Linting must pass
  - All tests must pass
  - TypeScript compilation must succeed
- **Commit strategy**: Use squash or conventional commits for clean history
- **Cleanup**: Delete the feature/fix/chore branch after merge

#### To `main` Branch:
- **Source**: Only from `develop` branch
- **Minimum reviewers**: 2 approved reviews required
- **Checks required**:
  - All linting and tests must pass
  - Code coverage targets must be met
  - Release notes must be prepared
- **Timing**: Only merge when preparing a production release
- **Cleanup**: Ensure corresponding tag is created for version tracking

## Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `chore`: Build process, dependencies, tooling
- `docs`: Documentation changes
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `style`: Code formatting (whitespace, semicolons, etc.)

### Examples:
```
feat(queue): add queue priority system
fix(auth): resolve session timeout issue
chore(deps): update typescript to 5.3
docs(readme): update setup instructions
refactor(api): simplify client request handler
```

## Code Review Process

### For PR Authors:
1. Create a descriptive pull request
2. Ensure all automated checks pass
3. Respond to reviewer feedback promptly
4. Make requested changes and request re-review

### For Reviewers:
1. Check code logic and quality
2. Verify tests are adequate
3. Ensure no breaking changes (for `main` merges)
4. Request changes if needed before approving
5. Approve only when satisfied with the implementation

## Timeline for Branch Cleanup

- **Feature/fix/chore branches**: Delete immediately after merge to `develop`
- **Release branches** (if used): Keep for hotfix support, archive after release
- **Old branches**: Repository maintainer will clean up branches older than 30 days

## Protection Rules Summary

| Branch | Direct Commits | PR Required | Min Reviewers | Required Checks |
|--------|----------------|-------------|---------------|-----------------|
| `main` | ❌ Forbidden | ✅ Yes | 2 | All passing |
| `develop` | ❌ Discouraged | ✅ Yes | 1 | All passing |
| `feature/*` | ✅ Allowed | ✅ Yes | 1 | All passing |
| `fix/*` | ✅ Allowed | ✅ Yes | 1 | All passing |
| `chore/*` | ✅ Allowed | ✅ Yes | 1 | All passing |

## Questions & Support

For questions about the branching strategy, refer to this document or ask the project maintainers.
