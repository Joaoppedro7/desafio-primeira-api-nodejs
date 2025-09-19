#!/bin/bash

set -e

echo "=== Fly.io Migration Script ==="
echo "Timestamp: $(date)"
echo "Working directory: $(pwd)"
echo "User: $(whoami)"

echo "=== Environment Check ==="
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set"
    echo "Available environment variables:"
    env | sort
    exit 1
else
    echo "DATABASE_URL is set (length: ${#DATABASE_URL})"
fi

echo "=== Node.js Environment ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== File System Check ==="
echo "Current directory contents:"
ls -la

echo "=== Package.json Check ==="
if [ -f "package.json" ]; then
    echo "package.json exists"
    echo "Scripts available:"
    npm run 2>&1 | grep "  " || echo "No scripts found"
else
    echo "ERROR: package.json not found"
    exit 1
fi

echo "=== Drizzle Config Check ==="
if [ -f "drizzle.config.ts" ]; then
    echo "drizzle.config.ts exists"
else
    echo "ERROR: drizzle.config.ts not found"
    exit 1
fi

echo "=== Migration Files Check ==="
if [ -d "drizzle" ]; then
    echo "drizzle directory exists"
    echo "Migration files:"
    ls -la drizzle/*.sql 2>/dev/null || echo "No migration files found"
else
    echo "ERROR: drizzle directory not found"
    exit 1
fi

echo "=== Running Migration ==="
echo "Command: npm run db:migrate"
npm run db:migrate

echo "=== Migration Complete ==="
echo "Exit code: $?"
echo "Timestamp: $(date)"
