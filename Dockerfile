FROM myspecialway/msw-portal-base
COPY ./scripts/default-nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
COPY ./scripts/k8s/runtime /etc/runtime

WORKDIR /etc/runtime
CMD ./start.sh
