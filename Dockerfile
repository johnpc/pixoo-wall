# Use Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create a wrapper script
RUN echo '#!/bin/sh\n\
echo "Generating production config..."\n\
npm run generate-prod-config\n\
\n\
# Set default sleep duration if not provided\n\
SLEEP_DURATION=${SLEEP_DURATION:-60}\n\
\n\
echo "Starting update loop with ${SLEEP_DURATION} seconds interval..."\n\
ITERATION=0\n\
while true; do\n\
  ITERATION=$((ITERATION + 1))\n\
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting iteration ${ITERATION}"\n\
  timeout 55s npm run pixoo || echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Script timed out or failed - restarting"\n\
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Script completed, sleeping ${SLEEP_DURATION}s"\n\
  sleep ${SLEEP_DURATION}\n\
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Sleep completed, starting next iteration"\n\
done' > /app/run.sh
RUN chmod +x /app/run.sh

# Set the wrapper script as the entry point
CMD ["/app/run.sh"]
