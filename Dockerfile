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
while true; do\n\
  timeout 55s npm run pixoo || echo "Script timed out or failed - restarting"\n\
  sleep ${SLEEP_DURATION}\n\
done' > /app/run.sh
RUN chmod +x /app/run.sh

# Set the wrapper script as the entry point
CMD ["/app/run.sh"]
