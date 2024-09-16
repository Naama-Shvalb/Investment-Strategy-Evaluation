# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy pacd ckage.json and package-lock.json
COPY package.json package-lock.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY src ./src

# Build the TypeScript code
RUN npm run build

# Expose the desired port (change as necessary)
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
