#!/bin/sh
set -e

# Copy default data files into the persistent volume if they don't exist.
# This ensures fresh volumes get seeded without overwriting existing data.
if [ ! -f /app/data/services.json ]; then
  cp /app/data/.default/services.json /app/data/services.json
fi
if [ ! -f /app/data/gallery.json ]; then
  cp /app/data/.default/gallery.json /app/data/gallery.json
fi
if [ ! -f /app/data/admin.json ]; then
  cp /app/data/.default/admin.json /app/data/admin.json
fi

exec "$@"
