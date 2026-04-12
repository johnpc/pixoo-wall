#!/bin/sh
SLEEP_DURATION=${SLEEP_DURATION:-60}
echo "Starting update loop with ${SLEEP_DURATION}s interval..."
while true; do
  timeout 55s npx tsx scripts/update-wall.ts || echo "Script timed out or failed"
  sleep ${SLEEP_DURATION}
done
