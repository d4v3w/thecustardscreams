#!/bin/bash
set -e

echo "Running ESLint..."
pnpm lint || exit 1

echo "Running TypeScript type check..."
pnpm typecheck || exit 1

echo "Running tests..."
pnpm test || exit 1

echo "Building production bundle..."
next build || exit 1

echo "Production build completed successfully!"
