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

# Ensure uploads directory exists in the persistent data volume.
mkdir -p /app/data/uploads

# Migrate any legacy uploads from the public volume to the persistent data volume.
if [ -d /app/public/images/uploads ]; then
  for file in /app/public/images/uploads/*; do
    if [ -f "$file" ]; then
      name=$(basename "$file")
      if [ ! -f "/app/data/uploads/$name" ]; then
        cp "$file" "/app/data/uploads/$name"
      fi
    fi
  done
fi

exec "$@"
