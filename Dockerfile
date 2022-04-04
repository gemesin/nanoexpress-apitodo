FROM node:14.16.1

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 3030

CMD [ "node", "src/server.js" ]