---
description: Best practices for using the experimental Rolldown-based Vite bundler.
---

**OBJECTIVE:**
Maintaining ultra-fast build and iteration speeds using the Rolldown-based Vite environment.

**REASON:**
Rolldown is a high-performance Rust-based bundler. While compatible with many Vite features, it requires mindful plugin selection to maintain its speed advantage.

**DESCRIPTION:**
Efficiency and compatibility rules for the experimental Vite + Rolldown stack.

**INSTRUCTIONS:**

### Plugin Compatibility
- **Verify Rolldown Support**: Before adding a new Vite plugin, check for Rolldown compatibility. Avoid legacy plugins that rely heavily on complex Node.js-only APIs.
- **Minimize Heavy Plugins**: Only use essential plugins to keep the native Rust speed of Rolldown.

### Development Workflow
- **Trust the HMR**: Leverage the fast Hot Module Replacement. Avoid manual page reloads which can bypass the speed benefits of the bundler.
- **Optimize Imports**: Use named imports consistently to help the bundler perform effective tree-shaking.

### Build Optimization
- **Keep it Clean**: Periodically clean the `node_modules/.vite` cache if you notice unexpected build behavior during the experimental phase.
