#!/bin/bash

echo "Starting deployment migration script..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    echo "Available environment variables:"
    env | grep -E "(DATABASE|DB|POSTGRES)" || echo "No database-related environment variables found"
    exit 1
fi

echo "DATABASE_URL is set: ${DATABASE_URL:0:20}..."

# Test database connection
echo "Testing database connection..."
timeout 30s npx drizzle-kit migrate

if [ $? -eq 0 ]; then
    echo "Migration completed successfully"
    exit 0
else
    echo "Migration failed with exit code $?"
    echo "Trying to get more information..."
    
    # Try to connect to database directly
    echo "Attempting direct database connection test..."
    node -e "
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect()
        .then(() => {
            console.log('Database connection successful');
            return client.query('SELECT version()');
        })
        .then(result => {
            console.log('Database version:', result.rows[0].version);
            client.end();
        })
        .catch(err => {
            console.error('Database connection failed:', err.message);
            process.exit(1);
        });
    "
    exit 1
fi
