#!/bin/bash
# Install Playwright browsers for E2E testing

echo "Installing Playwright browsers..."
echo ""
echo "This will install:"
echo "  - Chromium (headless shell)"
echo "  - Firefox"
echo "  - WebKit"
echo ""

# Install all browsers
pnpm exec playwright install

echo ""
echo "Installation complete!"
echo ""
echo "To run tests:"
echo "  pnpm test:e2e              # Run all tests"
echo "  pnpm test:e2e:chromium     # Run Chromium only"
echo "  pnpm test:e2e:headed       # Run with visible browser"
