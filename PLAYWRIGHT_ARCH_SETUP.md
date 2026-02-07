# Playwright Browser Setup for Arch Linux

## The Issue

Playwright needs specific browser binaries that it manages itself. On Arch Linux, the standard installation might not work due to missing system dependencies.

## Solution for Arch Linux

### Option 1: Install System Dependencies (Recommended)

Playwright browsers need certain system libraries. Install them with:

```bash
# Install required dependencies for Playwright browsers
sudo pacman -S nss atk at-spi2-atk cups libdrm libxkbcommon libxcomposite libxdamage libxrandr mesa pango cairo alsa-lib gtk3 libxshmfence

# Then install Playwright browsers
pnpm exec playwright install

# Verify installation
ls ~/.cache/ms-playwright/
# Should show: chromium_headless_shell-1208, firefox-1506, webkit-2104, ffmpeg-1011
```

### Option 2: Install Chromium from Arch Repos

If Playwright's chromium doesn't work, use system Chromium:

```bash
# Install Chromium from Arch repos
sudo pacman -S chromium

# Update playwright.config.ts to use system chromium
# (Already configured in the project)
```

### Option 3: Use Docker (Most Reliable)

Run tests in a Docker container with all dependencies:

```bash
# Pull Playwright Docker image
docker pull mcr.microsoft.com/playwright:v1.58.2-jammy

# Run tests in container
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.58.2-jammy pnpm test:e2e
```

## Verify Installation

After installing dependencies, verify browsers are installed:

```bash
# Check if browsers are installed
ls ~/.cache/ms-playwright/

# Should show:
# - chromium_headless_shell-1208/
# - firefox-1506/
# - webkit-2104/
# - ffmpeg-1011/
```

## Run Tests

Once browsers are installed:

```bash
# Run all E2E tests
pnpm test:e2e

# Run only Chromium tests
pnpm test:e2e:chromium

# Run in headed mode (see browser)
pnpm test:e2e:headed
```

## Troubleshooting

### Error: "Executable doesn't exist"

This means the browser binary isn't installed. Try:

```bash
# Force reinstall browsers
pnpm exec playwright install --force
```

### Error: Missing shared libraries

Install the missing system dependencies:

```bash
# Check what's missing
ldd ~/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome

# Install missing libraries with pacman
sudo pacman -S <missing-package>
```

### Still Not Working?

Use the Docker option above - it's the most reliable for Arch Linux.
