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
RUN echo '#!/bin/sh\nwhile true; do\n  npx tsx scripts/update-wall.ts\n  sleep 60\ndone' > /app/run.sh
RUN chmod +x /app/run.sh

# Set the wrapper script as the entry point
CMD ["/app/run.sh"]
