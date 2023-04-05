FROM node:18.13.0-alpine as build
RUN mkdir /usr/app
COPY . /usr/app
WORKDIR /usr/app
RUN npm i --silent
RUN npm run build

FROM nginx:1.19.0-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /usr/app/dist .
COPY ./nginx/react.conf /etc/nginx/conf.d/react.conf
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]