FROM nginx:alpine

LABEL Name=buildupporfolio Version=0.0.1

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
