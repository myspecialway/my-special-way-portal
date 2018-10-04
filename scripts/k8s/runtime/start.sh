mkdir /usr/share/nginx/html/assets/config
./hot-config-generator /usr/share/nginx/html/assets/config/hot-config.js
nginx -g "daemon off;"
