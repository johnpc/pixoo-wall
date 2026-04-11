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
RUN echo '#!/bin/sh\nSLEEP_DURATION=${SLEEP_DURATION:-60}\necho "Starting update loop with ${SLEEP_DURATION}s interval..."\nwhile true; do\n  timeout 55s npx tsx scripts/update-wall.ts || echo "Script timed out or failed"\n  sleep ${SLEEP_DURATION}\ndone' > /app/run.sh && chmod +x /app/run.sh

CMD ["/app/run.sh"]
