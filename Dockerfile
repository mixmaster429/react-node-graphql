FROM node:10-alpine
WORKDIR /app
COPY package.json /app
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp env-cmd -g
RUN npm install
COPY . /app
EXPOSE 4000
RUN npm run build:staging
CMD ["npm", "run", "node:staging"]
