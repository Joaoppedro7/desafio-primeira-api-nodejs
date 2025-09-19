#!/bin/bash

echo "=== Fly.io Release Command Debug ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Environment Variables ==="
echo "DATABASE_URL: ${DATABASE_URL:+SET}"
echo "NODE_ENV: $NODE_ENV"

echo "=== Available files ==="
ls -la

echo "=== Package.json scripts ==="
cat package.json | grep -A 20 '"scripts"'

echo "=== Running migration ==="
npm run db:migrate

echo "=== Migration result ==="
echo "Exit code: $?"
