#!/bin/bash
# Update Playwright visual regression baselines

echo "Updating Playwright visual snapshots..."
echo ""

pnpm exec playwright test --project=chromium --update-snapshots

echo ""
echo "Snapshots updated! Run 'pnpm test:e2e:chromium' to verify."
