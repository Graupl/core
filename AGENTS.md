# Project instructions

Graupl Core is part of Graupl and Accessible Ecosystem.

Read the [contribution guidelines](.github/CONTRIBUTING.md), [AI contribution policy](.github/AI_CONTRIBUTIONS.md), and [accessibility policy](.github/ACCESSIBILITY.md). Use [Unslop](skills/unslop/SKILL.md) for documentation, comments, and explanations.

Follow [Accessible Ecosystem Core's project instructions](https://github.com/Accessible-Ecosystem/core/blob/1.x/AGENTS.md) where they apply. Have another agent independently review each change and resolve its findings before finishing.

Keep JavaScript source in `src/js/`. Keep Sass source in `src/scss/` and public entry points in `scss/`. Preserve the package exports and compiled file paths that consumers use. Run the checks in the contribution guidelines and verify the packed package when changing its build or exports.

Use browser tests for visual regression. Use Playwright and `toMatchScreenshot()` to compare rendered output against screenshot baselines. Generate baselines on Linux to match CI.

## Documentation and examples

- Verify documented option names, defaults, and behavior against the version the docs load. When an example demonstrates keyboard handling, timing, or what happens at a boundary, change the option and exercise that behavior in a browser.
- Use consistent names and structure across related examples. Keep setup in each guide when that makes it easier to see which component the example creates, which options it passes, and how it disposes of the instance.

## Component behavior and tests

- Preserve inherited initialization, disposal, and event timing. Keep component-specific behavior in its own class and use Core's lifecycle helpers for listeners and deferred work.
- Add focused coverage to the existing component suite. Exercise the behavior this component owns and rely on Core's tests for unchanged inherited behavior. When changing tests, have the reviewer compare the new assertions with the previous coverage.
