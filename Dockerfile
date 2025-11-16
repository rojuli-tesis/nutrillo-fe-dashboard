# Use an official Node.js runtime as a parent image with the required version
FROM node:18.17.0-alpine

# Set the working directory
WORKDIR /app

# Install wget for container health checks
RUN apk add --no-cache wget

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Build arguments for environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Conditionally run the build step based on the environment
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Verify build output exists
RUN if [ "$NODE_ENV" = "production" ]; then \
      if [ ! -d ".next" ]; then \
        echo "ERROR: Build failed - .next directory not found"; \
        exit 1; \
      fi; \
    fi

# Expose the port that the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]