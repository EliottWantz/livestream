FROM node:lts-alpine

WORKDIR /user/src/app

COPY package.json ./

RUN npm install

COPY ["index.html", "index.ts", "thevid.mp4", "./"]

EXPOSE 3000

CMD [ "npm", "run", "dev" ]