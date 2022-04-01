FROM nginx:1.15

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf.d/* /etc/nginx/conf.d/
RUN mkdir -p storybook-static/assets
COPY logo.svg storybook-static/assets
COPY storybook-static /var/www
