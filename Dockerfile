# Use an official Node.js runtime as a parent image with the required version
FROM node:18.17.0-alpine

# Set the working directory
WORKDIR /app

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
RUN if [ "$NODE_ENV" = "production" ]; then yarn build; fi
# Expose the port that the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]