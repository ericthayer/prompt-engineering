#!/bin/bash

# Agentic Orchestration Initialization Script
# This script initializes the project with global agent rules using a copy strategy.

GLOBAL_RULES_DIR="$HOME/.antigravity/rules"
PROJECT_RULES_DIR=".agent/rules"

echo "🚀 Initializing Agentic Orchestration..."

# 1. Check for Global Rules
if [ ! -d "$GLOBAL_RULES_DIR" ]; then
    echo "⚠️  Global rules directory not found at $GLOBAL_RULES_DIR"
    echo "Please ensure you have moved your global rules to this location."
    exit 1
fi

# 2. Create Project Rules Directory
if [ ! -d "$PROJECT_RULES_DIR" ]; then
    echo "📂 Creating $PROJECT_RULES_DIR..."
    mkdir -p "$PROJECT_RULES_DIR"
fi

# 3. Copy Rules
echo "📄 Copying global rules to $PROJECT_RULES_DIR..."
for file in "$GLOBAL_RULES_DIR"/*.md; do
    filename=$(basename "$file")
    dest="$PROJECT_RULES_DIR/$filename"
    
    # If destination exists and is a symlink, remove it first
    if [ -L "$dest" ]; then
        echo "🗑️  Removing existing symlink: $dest"
        rm "$dest"
    fi
    
    cp -v "$file" "$dest"
done

# 4. Success
echo "✅ Initialization complete!"
echo "Your AI agent now has access to global rules in this project."
echo "Workflow: Use 'sdd-workflow' to start building new features."
