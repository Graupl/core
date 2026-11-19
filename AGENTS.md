# Project instructions

Graupl Core is part of Graupl and Accessible Ecosystem.

Read the [contribution guidelines](.github/CONTRIBUTING.md), [AI contribution policy](.github/AI_CONTRIBUTIONS.md), and [accessibility policy](.github/ACCESSIBILITY.md). Use [Unslop](skills/unslop/SKILL.md) for documentation, comments, and explanations.

Keep JavaScript source in `src/js/`. Keep Sass source in `src/scss/` and public entry points in `scss/`. Preserve the package exports and compiled file paths that consumers use. Run the checks in the contribution guidelines and verify the packed package when changing its build or exports.

Use browser tests for visual regression. Use Playwright and `toMatchScreenshot()` to compare rendered output against screenshot baselines. Generate baselines on Linux to match CI.
