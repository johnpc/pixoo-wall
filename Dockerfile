FROM node:20-alpine

WORKDIR /app

# Use docker-specific package with lockfile
COPY package.docker.json ./package.json
COPY package-lock.docker.json ./package-lock.json
RUN npm ci

# Copy only what the script needs
COPY scripts/ ./scripts/
COPY helpers/ ./helpers/
COPY amplify/ ./amplify/
COPY tsconfig.json ./
COPY amplify_outputs.json ./
COPY run.sh ./
RUN chmod +x /app/run.sh

CMD ["/app/run.sh"]
