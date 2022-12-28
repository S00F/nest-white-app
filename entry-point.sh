#!/bin/bash
export PRIVATE_KEY=$(cat /etc/cert/jwtRS512.key)
export PUBLIC_KEY=$(cat /etc/cert/jwtRS512.key.pub)

# wait-for-postgres.sh
set -e

until PGPASSWORD=$DB_PASSWORD psql -h "$DB_ADDRESS" -U "$DB_USERNAME" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

npm run database:migrate
npm run start:dev
