FROM node:20-alpine

WORKDIR /app

# Copy everything including workspace config & packages
COPY package.json package-lock.json ./
COPY apps ./apps

# Install from workspace root so hoisting works
RUN npm ci

# Run your app
CMD ["npm", "run", "--workspace=apd-ui", "dev"]
