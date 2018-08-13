FROM nginx:stable
COPY ./scripts/default-nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
