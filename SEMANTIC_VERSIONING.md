# Semantic Versioning & Conventional Commits

This project uses **Semantic Release** to automate versioning and changelog generation.

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (Minor release)
- **fix**: A bug fix (Patch release)
- **perf**: A performance improvement (Patch release)
- **docs**: Documentation changes (No release)
- **style**: Changes that do not affect the meaning of the code (No release)
- **refactor**: A code change that neither fixes a bug nor adds a feature (No release)
- **test**: Adding missing tests or correcting existing tests (No release)
- **chore**: Changes to the build process or auxiliary tools and libraries (No release)

### Breaking Changes

Breaking changes MUST be indicated by an `!` after the type/scope, or by including `BREAKING CHANGE:` in the footer.

**Example:**
```
feat!: refactor authentication API
```
or
```
feat: simplify oauth flow

BREAKING CHANGE: the old oauth endpoint is now removed.
```
