#!/bin/sh
set -eu

RESOLVER_IP="$(awk '/^nameserver / { print $2; exit }' /etc/resolv.conf)"

if [ -z "${RESOLVER_IP}" ]; then
  echo "resolver 8.8.8.8 valid=30s ipv6=off;" > /etc/nginx/conf.d/resolver.conf
else
  echo "resolver ${RESOLVER_IP} valid=30s ipv6=off;" > /etc/nginx/conf.d/resolver.conf
fi
