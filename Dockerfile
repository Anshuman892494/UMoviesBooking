# Stage 1: Build the React Application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files and build the app
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Override the default Nginx configuration with yours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create the folder that your nginx.conf expects
RUN mkdir -p /var/www/umoviesbooking

# Copy the built React app from Stage 1 into the Nginx folder
COPY --from=build /app/dist /var/www/umoviesbooking/

# Expose port 80 to the outside
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
