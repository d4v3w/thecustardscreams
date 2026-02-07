#!/bin/bash
# Simple script to test Playwright with system Chromium

echo "Testing Playwright with system Chromium..."
echo ""

# Run tests
pnpm exec playwright test --project=chromium --reporter=list

echo ""
echo "Test complete! Check output above for results."
