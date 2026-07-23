
FROM node:20
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm install
RUN cd frontend && npm install
COPY . .
EXPOSE 3000 3001
CMD ["npm", "start"]

