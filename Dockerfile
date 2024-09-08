# Use the official MongoDB image as the base
FROM mongo:latest

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm --no-install-recommends

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Set environment variables
ENV MONGO_INITDB_DATABASE="invoice-generator"
ENV MONGO_URI="mongodb://localhost:27017/invoice-generator"
ENV PORT="5000"
ENV JWT_SECRET="s8D5!2jM@cZ#vW7p2$J9rR8mL3&kF"

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --omit=dev

# Copy the application code to the working directory
COPY . .

# Expose the ports for the Node.js application and MongoDB
EXPOSE 5000
EXPOSE 27017

# Start MongoDB and the Node.js application
CMD ["sh", "-c", "mongod & npm start"]
