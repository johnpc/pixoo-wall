FROM node:20-alpine

WORKDIR /app

# Use docker-specific package
COPY package.docker.json ./package.json
RUN npm install --omit=dev

# Copy only what the script needs
COPY scripts/ ./scripts/
COPY helpers/ ./helpers/
COPY amplify/ ./amplify/
COPY tsconfig.json ./
COPY amplify_outputs.json ./
COPY run.sh ./
RUN chmod +x /app/run.sh

CMD ["/app/run.sh"]
