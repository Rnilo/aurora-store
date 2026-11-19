# ============================================
# STAGE 1: build de Angular
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ============================================
# STAGE 2: nginx sirviendo el build
# ============================================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/aurora-store/browser /usr/share/nginx/html

EXPOSE 80
