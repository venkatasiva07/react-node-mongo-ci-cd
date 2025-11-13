FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy rest of code
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
