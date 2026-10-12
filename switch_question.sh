#!/usr/bin/env bash
# ==============================================================================
# Script: switch_question.sh
# Description: Copies selected question components from assets/ to my-app/src/
# Usage: ./switch_question.sh [question_name] [--no-start]
# ==============================================================================

ASSETS_DIR="assets"
TARGET_APP_DIR="my-app"
TARGET_SRC_DIR="$TARGET_APP_DIR/src"
TARGET_COMP_DIR="$TARGET_SRC_DIR/components"

# 1. Verify environment
if [ ! -d "$ASSETS_DIR" ]; then
    echo -e "\033[0;31mError: '$ASSETS_DIR' directory not found. Please run this script from the project root.\033[0m"
    exit 1
fi

if [ ! -d "$TARGET_APP_DIR" ]; then
    echo -e "\033[0;31mError: '$TARGET_APP_DIR' directory not found.\033[0m"
    exit 1
fi

QUESTION=""
NO_START=0

for arg in "$@"; do
    if [ "$arg" == "--no-start" ]; then
        NO_START=1
    elif [ -z "$QUESTION" ]; then
        QUESTION="$arg"
    fi
done

# 2. Prompt user if question argument was not provided
if [ -z "$QUESTION" ]; then
    echo -e "\033[0;36m==========================================\033[0m"
    echo -e "\033[0;36m       React Question Switcher (IPE III)  \033[0m"
    echo -e "\033[0;36m==========================================\033[0m"
    echo -e "\033[0;33mAvailable questions in assets:\033[0m"
    ls -d "$ASSETS_DIR"/q* 2>/dev/null | xargs -n 1 basename
    echo ""
    read -p "Enter the question name to run (e.g. 'q1' or '1'): " QUESTION
fi

# Normalize input (e.g. '1' -> 'q1', 'Q1' -> 'q1')
QUESTION=$(echo "$QUESTION" | tr '[:upper:]' '[:lower:]' | xargs)
if [[ "$QUESTION" =~ ^[0-9]+$ ]]; then
    QUESTION="q$QUESTION"
fi

SOURCE_DIR="$ASSETS_DIR/$QUESTION"
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "\033[0;31mError: Question directory '$SOURCE_DIR' does not exist.\033[0m"
    echo -e "\033[0;33mAvailable: $(ls -d "$ASSETS_DIR"/q* 2>/dev/null | xargs -n 1 basename | tr '\n' ' ')\033[0m"
    exit 1
fi

echo -e "\033[0;36mProcessing question: $QUESTION...\033[0m"

# 3. Ensure target directories exist
mkdir -p "$TARGET_SRC_DIR"
mkdir -p "$TARGET_COMP_DIR"

# 4. Remove stale App files in my-app/src
rm -f "$TARGET_SRC_DIR/App.js" "$TARGET_SRC_DIR/App.jsx"

# 5. Copy App component
if [ -f "$SOURCE_DIR/App.jsx" ]; then
    cp -f "$SOURCE_DIR/App.jsx" "$TARGET_SRC_DIR/App.jsx"
    echo -e "\033[0;32mCopied: App.jsx -> my-app/src/App.jsx\033[0m"
elif [ -f "$SOURCE_DIR/App.js" ]; then
    cp -f "$SOURCE_DIR/App.js" "$TARGET_SRC_DIR/App.js"
    echo -e "\033[0;32mCopied: App.js -> my-app/src/App.js\033[0m"
else
    echo -e "\033[0;33mWarning: No App.jsx or App.js found in $SOURCE_DIR\033[0m"
fi

# 6. Copy other components into src/ and src/components/
for file in "$SOURCE_DIR"/*; do
    fname=$(basename "$file")
    if [ "$fname" != "App.jsx" ] && [ "$fname" != "App.js" ] && [ -f "$file" ]; then
        cp -f "$file" "$TARGET_SRC_DIR/$fname"
        cp -f "$file" "$TARGET_COMP_DIR/$fname"
        echo -e "\033[0;32mCopied: $fname -> my-app/src/ & my-app/src/components/\033[0m"
    fi
done

echo ""
echo -e "\033[0;32m==========================================\033[0m"
echo -e "\033[0;32m Successfully loaded $QUESTION into my-app! \033[0m"
echo -e "\033[0;32m==========================================\033[0m"
echo ""
echo -e "\033[0;33mTo run the app manually:\033[0m"
echo -e "  cd my-app"
echo -e "  npm start"
echo ""

if [ "$NO_START" -eq 0 ]; then
    read -p "Do you want to start the app now? (y/n) [default: y]: " START_NOW
    START_NOW=$(echo "$START_NOW" | tr '[:upper:]' '[:lower:]')

    if [ -z "$START_NOW" ] || [ "$START_NOW" = "y" ] || [ "$START_NOW" = "yes" ]; then
        echo -e "\033[0;36mStarting React app in my-app...\033[0m"
        cd "$TARGET_APP_DIR" && npm start
    fi
fi
