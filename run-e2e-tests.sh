#!/bin/bash
# Simple script to run Playwright E2E tests

echo "Running Playwright E2E tests..."
pnpm exec playwright test --project=chromium --reporter=list

echo ""
echo "Test run complete!"
