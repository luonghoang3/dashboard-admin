FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g tailwindcss postcss autoprefixer

COPY . .

# Setup tailwind if not already set up
RUN npx tailwindcss init -p || true

EXPOSE 3000

CMD ["npm", "run", "dev"]
