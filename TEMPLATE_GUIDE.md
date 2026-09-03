# Agentic Orchestration Template Guide

This guide explains how to use this repository as a template for new projects, preserving the "Agentic Orchestration" model and technical stack.

## Initial Setup

1. **Clone the Template**:
   ```bash
   git clone <template-repo-url> my-new-project
   cd my-new-project
   ```

2. **Run the Initialization Script**:
   This script copies the global standards (accessibility, SDD, etc.) from your system-wide `~/.antigravity/rules` into the local project.
   ```bash
   sh scripts/init-orchestration.sh
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

## Workflow: Spec-Driven Development (SDD)

This template is built for **Spec-Driven Development**. Every new feature should start with a specification.

1. **Initialize the Agent**:
   Tell the AI: "Call /setup-orchestration to initialize this workspace."
2. **Define a Spec**:
   Run `/sdd-workflow` to generate a new `SPEC.md` for your feature.
3. **Execute**:
   The agent will use the `SPEC.md` and the rules in `.agent/rules` to implement the feature with high precision.

## System Requirements

- **Shell**: Bash (Mac/Linux).
- **Global Rules**: Move your shared agent rules to `~/.antigravity/rules/` before running the initialization script.
- **Node**: v18+ recommended.

---
For a deeper dive into why we use this model, see [AGENTIC_ORCHESTRATION.md](file:///Users/thayere/Documents/_DEV/threejs/AGENTIC_ORCHESTRATION.md).
