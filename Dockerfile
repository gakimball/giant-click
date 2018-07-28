FROM mhart/alpine-node:10

# Create and set the default working directory
WORKDIR /usr/src

# Copy package.json and lock file for the build
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy remaining files
COPY . .

# build and export the app
RUN npm run build
RUN npm run export -o /public
