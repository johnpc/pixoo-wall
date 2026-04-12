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
COPY run.sh ./
RUN chmod +x /app/run.sh

CMD ["/app/run.sh"]
