FROM node:20.19.0-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application with Webpack explicitly
RUN NODE_OPTIONS="--max_old_space_size=4096" npm run build

# Expose the port the app will run on
EXPOSE 3000

# For standalone output, we need to use node directly on the standalone server.js
CMD ["node", ".next/standalone/server.js"]
