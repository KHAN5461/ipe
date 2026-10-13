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
    read -p "Enter question name, number, or keyword (e.g. 'q1', '1', 'product'): " QUESTION
fi

# Normalize input (e.g. '1' -> 'q1', 'Q1' -> 'q1')
CLEAN_INPUT=$(echo "$QUESTION" | tr '[:upper:]' '[:lower:]' | xargs)
if [[ "$CLEAN_INPUT" =~ ^[0-9]+$ ]]; then
    CLEAN_INPUT="q$CLEAN_INPUT"
fi

# Find directory: exact match, prefix match (q1-*), or substring match
MATCHED_DIR=""
if [ -d "$ASSETS_DIR/$CLEAN_INPUT" ]; then
    MATCHED_DIR="$ASSETS_DIR/$CLEAN_INPUT"
else
    # Check for prefix match like q1-*
    for d in "$ASSETS_DIR"/$CLEAN_INPUT-*; do
        if [ -d "$d" ]; then
            MATCHED_DIR="$d"
            break
        fi
    done
fi

if [ -z "$MATCHED_DIR" ]; then
    # Check for substring match
    for d in "$ASSETS_DIR"/*"$CLEAN_INPUT"*; do
        if [ -d "$d" ]; then
            MATCHED_DIR="$d"
            break
        fi
    done
fi

if [ -z "$MATCHED_DIR" ] || [ ! -d "$MATCHED_DIR" ]; then
    echo -e "\033[0;31mError: Could not find any question matching '$QUESTION'.\033[0m"
    echo -e "\033[0;33mAvailable questions:\033[0m"
    ls -d "$ASSETS_DIR"/q* 2>/dev/null | xargs -n 1 basename
    exit 1
fi

SOURCE_DIR="$MATCHED_DIR"
QUESTION_NAME=$(basename "$MATCHED_DIR")

echo -e "\033[0;36mProcessing question: $QUESTION_NAME...\033[0m"

# 3. Clean previous question components
mkdir -p "$TARGET_SRC_DIR"
rm -f "$TARGET_SRC_DIR"/*.jsx
rm -rf "$TARGET_COMP_DIR"
mkdir -p "$TARGET_COMP_DIR"

# 4. Copy App component
if [ -f "$SOURCE_DIR/App.jsx" ]; then
    cp -f "$SOURCE_DIR/App.jsx" "$TARGET_SRC_DIR/App.jsx"
    echo -e "\033[0;32mCopied: App.jsx -> my-app/src/App.jsx\033[0m"
elif [ -f "$SOURCE_DIR/App.js" ]; then
    cp -f "$SOURCE_DIR/App.js" "$TARGET_SRC_DIR/App.js"
    echo -e "\033[0;32mCopied: App.js -> my-app/src/App.js\033[0m"
else
    echo -e "\033[0;33mWarning: No App.jsx or App.js found in $SOURCE_DIR\033[0m"
fi

# 5. Copy other components into src/ and src/components/
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
echo -e "\033[0;32m Successfully loaded $QUESTION_NAME into my-app! \033[0m"
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
