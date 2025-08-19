# stage 0, "build react app"

FROM node:20-alpine as build-react-app

WORKDIR workdir
COPY . .
RUN npm install -g npm@latest
RUN npm install @mui/material @emotion/react @emotion/styled
RUN npm i
RUN npm run build

# stage 1, nginx
FROM nginx:1.23-alpine
COPY --from=build-react-app /workdir/build/ /usr/share/nginx/html
COPY /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf