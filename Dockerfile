FROM node:20-alpine

WORKDIR /app

# Use minimal package.json
COPY package.docker.json ./package.json
RUN npm install

# Copy only what the script needs
COPY scripts/ ./scripts/
COPY helpers/ ./helpers/
COPY amplify/ ./amplify/
COPY tsconfig.json ./
COPY amplify_outputs.json ./

# Create wrapper script
COPY <<'EOF' /app/run.sh
#!/bin/sh
SLEEP_DURATION=${SLEEP_DURATION:-60}
echo "Starting update loop with ${SLEEP_DURATION}s interval..."
while true; do
  timeout 55s npx tsx scripts/update-wall.ts || echo "Script timed out or failed"
  sleep ${SLEEP_DURATION}
done
EOF
RUN chmod +x /app/run.sh

CMD ["/app/run.sh"]
