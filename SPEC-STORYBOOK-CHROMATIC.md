# SPEC: Storybook, Chromatic, & Semantic Release Integration

## 1. Goal & Intent
Implement a robust testing and release pipeline to ensure visual consistency, accessibility compliance, and automated versioning.
- **Storybook**: Component-driven development and documentation environment.
- **Chromatic**: Automated visual regression testing and accessibility audits in CI.
- **GitHub Actions**: Automated pipeline for Chromatic checks and Semantic Release.
- **Semantic Release**: Fully automated versioning and GitHub release generation based on Conventional Commits.

## 2. Usage & Interface
- **Storybook**: Start local development with `npm run storybook`.
- **Chromatic**: Triggered via GitHub Actions on PRs to `main` and `develop`.
- **Semantic Release**: Triggered upon merge to `main`.

## 3. Technical Implementation
- **Dependencies**:
  - `storybook`, `@storybook/react-vite`
  - `chromatic`
  - `semantic-release`, `@semantic-release/github`, `@semantic-release/npm`, `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`
- **CI/CD Stack**: GitHub Actions.
- **Environment Variables**:
  - `CHROMATIC_PROJECT_TOKEN` (provided by user/Chromatic dashboard)
  - `GITHUB_TOKEN` (automatic for GH Actions)

## 4. Visuals & Interaction
- Storybook will use the project's Tailwind v4 configuration to ensure styles match.
- Chromatic will capture snapshots across different viewports (Mobile, Tablet, Desktop).

## 5. Accessibility (WCAG 2.1)
- [ ] Storybook `a11y` addon installed and configured.
- [ ] Chromatic's accessibility testing enabled in CI.
- [ ] Ensure all components in Storybook pass automated a11y checks.

## 6. Performance
- [ ] Optimize Storybook build size.
- [ ] Use Chromatic's Turbo build feature if possible.
- [ ] Ensure CI pipeline executes in < 5 minutes.

## 7. Implementation Checklist
- [x] **Scaffolding Storybook**: Install and initialize Storybook with React + Vite.
- [x] **Tailwind v4 Integration**: Configure Storybook to correctly load `src/index.css`.
- [x] **Chromatic Setup**: Install `chromatic` package and create GitHub Action workflow.
- [x] **Semantic Release Setup**: Install `semantic-release` and configure `.releaserc` with custom `releaseRules`.
- [x] **Workflow Creation**: 
    - [x] `chromatic.yml` for PR checks.
    - [x] `release.yml` for semantic releases on `main`.
- [x] **Verification**: Run local Storybook, run test Chromatic build, verify semantic release dry-run.
- [x] **Page Assemblage**: Create `AppLanding` story to showcase the full page.
- [x] **PR Automation**: Created `pull_request_template.md` and `SEMANTIC_VERSIONING.md`.

## 8. Changelog
- **2026-01-24**: Initial spec creation for Storybook/Chromatic/Semantic Release integration.
- **2026-01-24 16:28**: All core features implemented and verified with a local Storybook build.
- **2026-01-24 17:05**: Created `AppLanding` story to assemble the full home page.
- **2026-01-24 17:07**: Refined `semantic-release` rules for automated versioning based on commit types.
- **2026-01-24 17:10**: Added Pull Request Template and Semantic Versioning documentation.
- **2026-01-24 17:13**: Implemented dynamic version display via `vite.config.ts` and `AppFooter`.
