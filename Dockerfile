# Use an official Node.js runtime as a parent image with the required version
FROM node:18.17.0-alpine

# Set the working directory
WORKDIR /app

# Install wget for container health checks
RUN apk add --no-cache wget

# Build arguments for environment
ARG NODE_ENV=production
ARG BUILD_ID=unknown
# Use BUILD_ID to force cache invalidation on each deployment
# This ensures we always rebuild with latest code even if files haven't changed
LABEL build_id=${BUILD_ID}
# Echo BUILD_ID to create a layer that changes on each deployment, forcing cache invalidation
RUN echo "Build ID: ${BUILD_ID}"

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
# Use BUILD_ID in a comment to force cache invalidation
# This ensures COPY layer is rebuilt even if file checksums are the same
COPY . .

# Verify critical files exist before building (with detailed diagnostics)
RUN if [ "$NODE_ENV" = "production" ]; then \
      echo "=== File Verification ==="; \
      echo "Build ID: ${BUILD_ID}"; \
      echo "Current directory: $(pwd)"; \
      echo "Total files in build context:"; \
      find . -type f ! -path "*/node_modules/*" ! -path "*/.next/*" | wc -l; \
      echo ""; \
      echo "Checking src directory structure:"; \
      ls -la src/ 2>&1 || echo "ERROR: src/ directory not found!"; \
      echo ""; \
      echo "Files in src/utils:"; \
      ls -la src/utils/ 2>&1 || echo "ERROR: src/utils directory not found!"; \
      echo ""; \
      echo "Files in src/components:"; \
      ls -la src/components/ 2>&1 || echo "ERROR: src/components directory not found!"; \
      echo ""; \
      echo "Files in src/components/Button:"; \
      ls -la src/components/Button/ 2>&1 || echo "ERROR: src/components/Button directory not found!"; \
      echo ""; \
      echo "Files in src/components/dashboard:"; \
      ls -la src/components/dashboard/ 2>&1 || echo "ERROR: src/components/dashboard directory not found!"; \
      echo ""; \
      echo "Verifying required files..."; \
      test -f src/utils/restClient.ts || (echo "ERROR: src/utils/restClient.ts not found" && exit 1); \
      test -f src/components/Button/index.tsx || (echo "ERROR: src/components/Button/index.tsx not found" && exit 1); \
      test -f src/components/dashboard/StatsCard.tsx || (echo "ERROR: src/components/dashboard/StatsCard.tsx not found" && exit 1); \
      echo "✓ All required files found"; \
    fi

ENV NODE_ENV=${NODE_ENV}
ENV BUILD_ID=${BUILD_ID}

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