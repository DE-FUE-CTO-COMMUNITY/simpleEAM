#!/bin/bash

# Script to setup private GitHub repository for Excalidraw fork
# Run this script after creating the private repository on GitHub

# Variables - UPDATE THESE WITH YOUR ACTUAL VALUES
GITHUB_USERNAME="marcus-friedrich"  # Replace with your GitHub username
REPO_NAME="simple-eam-excalidraw"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up private GitHub repository for Excalidraw fork...${NC}"

# Navigate to the Excalidraw fork directory
cd /home/mf2admin/simple-eam/packages/simple-eam-excalidraw/packages/excalidraw

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in the correct Excalidraw directory!${NC}"
    exit 1
fi

# Check if upstream remote exists (should be renamed from origin)
if ! git remote | grep -q "upstream"; then
    echo -e "${RED}Error: 'upstream' remote not found. Please run: git remote rename origin upstream${NC}"
    exit 1
fi

# Add the private GitHub repository as origin
echo -e "${BLUE}Adding private GitHub repository as 'origin' remote...${NC}"
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Verify remote configuration
echo -e "${BLUE}Current remote configuration:${NC}"
git remote -v

# Push the current branch to the private repository
echo -e "${BLUE}Pushing to private repository...${NC}"
git push -u origin eam-main

# Create and switch to main branch for consistency
echo -e "${BLUE}Creating and pushing main branch...${NC}"
git checkout -b main
git push -u origin main

# Switch back to eam-main for development
git checkout eam-main

echo -e "${GREEN}✅ Private repository setup complete!${NC}"
echo -e "${GREEN}Repository remotes:${NC}"
echo -e "  ${BLUE}upstream:${NC} https://github.com/excalidraw/excalidraw.git (original Excalidraw)"
echo -e "  ${BLUE}origin:${NC}   https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git (your private fork)"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo -e "1. Your Excalidraw fork is now backed by a private GitHub repository"
echo -e "2. You can continue development on the 'eam-main' branch"
echo -e "3. Push changes with: ${BLUE}git push origin eam-main${NC}"
echo -e "4. Pull upstream updates with: ${BLUE}git pull upstream master${NC}"
