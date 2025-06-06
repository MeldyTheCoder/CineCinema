FROM node:24-alpine3.21 AS prod

WORKDIR /app
COPY package.json package-lock.json /app
RUN npm install -g npm
RUN npm install --save typescript @types/node @types/react @types/react-dom @types/jest
RUN npm install --legacy-peer-deps

COPY . /app
RUN npm run build


FROM umputun/nginx-le

ENV LETSENCRYPT=false
ENV LE_EMAIL=software.dev1988@gmail.com
ENV LE_FQDN=cine-cinema.ru

WORKDIR /usr/local/bin

COPY --from=prod /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/service.conf