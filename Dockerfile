FROM node:23-slim
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 1480
CMD [ "node", "server.js" ]