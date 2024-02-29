# Use an official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .
RUN npm install
RUN chown -R node:node /app

# RUN chmod +x /app/node_modules -R

# Switch to the non-root user
USER node

# Install dependencies


# Expose the port that the Node.js application will run on
EXPOSE 3000


# Define the command to run the Node.js application
CMD ["sh", "-c", "cd /app && npm run build && npm run start"]
