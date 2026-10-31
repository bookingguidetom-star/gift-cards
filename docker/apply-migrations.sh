#!/bin/sh
# Applies every SQL file in /migrations exactly once, in filename order.
# Idempotent: re-running only applies files that are not yet recorded in
# public._base44_migrations, so container restarts are safe.
set -eu

: "${DB_HOST:=db}"
: "${DB_USER:=postgres}"
: "${DB_NAME:=postgres}"
: "${DB_PASSWORD:=}"
: "${AUTHENTICATOR_PASSWORD:=base44devpg}"

export PGPASSWORD="$DB_PASSWORD"
PSQL="psql -X -q -v ON_ERROR_STOP=1 -h $DB_HOST -U $DB_USER -d $DB_NAME"

# 1. Supabase-compatible roles. The migrations GRANT to anon/authenticated and
#    create RLS policies for them; PostgREST connects as "authenticator" and
#    switches to the role named in the JWT.
$PSQL <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOLOGIN NOINHERIT;
  END IF;
END
\$\$;

ALTER ROLE authenticator WITH LOGIN PASSWORD '$AUTHENTICATOR_PASSWORD';
GRANT anon, authenticated, service_role TO authenticator;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
SQL

# 2. Migration ledger.
$PSQL -c "CREATE TABLE IF NOT EXISTS public._base44_migrations (filename text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());"

# 3. Apply pending migrations.
for f in $(ls /migrations/*.sql* | sort); do
  base=$(basename "$f")
  if [ "$($PSQL -tAc "SELECT 1 FROM public._base44_migrations WHERE filename = '$base'")" = "1" ]; then
    echo "skip   $base"
    continue
  fi
  echo "apply  $base"
  $PSQL --single-transaction -f "$f" \
    -c "INSERT INTO public._base44_migrations (filename) VALUES ('$base');"
done

echo "migrations complete"
