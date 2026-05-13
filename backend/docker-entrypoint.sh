#!/bin/sh
set -eu

url_decode() {
  encoded=$(printf '%s' "$1" | sed 's/+/ /g')
  printf '%b' "$(printf '%s' "$encoded" | sed 's/%/\\x/g')"
}

apply_database_url() {
  db_url="$1"

  case "$db_url" in
    jdbc:postgresql://*)
      export SPRING_DATASOURCE_URL="$db_url"
      return 0
      ;;
    postgres://*|postgresql://*)
      stripped="${db_url#postgres://}"
      stripped="${stripped#postgresql://}"
      credentials="${stripped%%@*}"
      address="${stripped#*@}"
      host_port="${address%%/*}"
      database_and_query="${address#*/}"
      database_name="${database_and_query%%\?*}"
      query_suffix=""

      if [ "${database_and_query#*\?}" != "$database_and_query" ]; then
        query_suffix="?${database_and_query#*\?}"
      fi

      export SPRING_DATASOURCE_URL="jdbc:postgresql://${host_port}/${database_name}${query_suffix}"

      if [ -z "${SPRING_DATASOURCE_USERNAME:-}" ]; then
        export SPRING_DATASOURCE_USERNAME="$(url_decode "${credentials%%:*}")"
      fi

      if [ -z "${SPRING_DATASOURCE_PASSWORD:-}" ]; then
        export SPRING_DATASOURCE_PASSWORD="$(url_decode "${credentials#*:}")"
      fi

      return 0
      ;;
    *)
      export SPRING_DATASOURCE_URL="$db_url"
      return 0
      ;;
  esac
}

if [ -n "${PORT:-}" ] && [ -z "${SERVER_PORT:-}" ]; then
  export SERVER_PORT="${PORT}"
fi

if [ -z "${SPRING_DATASOURCE_URL:-}" ] && [ -n "${DATABASE_URL:-}" ]; then
  apply_database_url "${DATABASE_URL}"
elif [ -n "${SPRING_DATASOURCE_URL:-}" ]; then
  apply_database_url "${SPRING_DATASOURCE_URL}"
fi

if [ -z "${AI_SERVICE_URL:-}" ] && [ -n "${AI_SERVICE_HOSTPORT:-}" ]; then
  export AI_SERVICE_URL="http://${AI_SERVICE_HOSTPORT}"
fi

exec java -jar /app/app.jar
