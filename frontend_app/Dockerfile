FROM node:lts-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
# Створення оптимізованої статичної збірки
RUN npm run build 

# --- STAGE 2: Serve Stage (використовуємо Nginx для легкості) ---
FROM nginx:alpine
# Копіюємо конфігурацію Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
