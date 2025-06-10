# Stage 1: Build the frontend application using Node.js 20.12.0

FROM node:20.12.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
 
 
# Stage 2: Hold only the build output

FROM alpine AS build-artifacts

# Copy the final build from the previous stage

COPY --from=builder /app/dist /build
 