# Use Node.js base image
FROM node:20-slim

WORKDIR /app

# Install deps first (cached unless package*.json changes)
COPY package*.json ./
RUN npm ci

# Copy source (separate layer - only rebuilds on code changes)
COPY scripts/ ./scripts/
COPY helpers/ ./helpers/
COPY amplify/ ./amplify/
COPY pages/ ./pages/
COPY *.ts ./
COPY *.json ./
COPY *.js ./

# Create wrapper script
RUN echo '#!/bin/sh\n\
echo "Generating production config..."\n\
npm run generate-prod-config\n\
SLEEP_DURATION=${SLEEP_DURATION:-60}\n\
echo "Starting update loop with ${SLEEP_DURATION}s interval..."\n\
while true; do\n\
  timeout 55s npm run pixoo || echo "Script timed out or failed"\n\
  sleep ${SLEEP_DURATION}\n\
done' > /app/run.sh && chmod +x /app/run.sh

CMD ["/app/run.sh"]
