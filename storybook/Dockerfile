FROM nginx:1.15

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf.d/* /etc/nginx/conf.d/
RUN echo "types { application/javascript js mjs; }" > /etc/nginx/conf.d/mjs.conf

COPY storybook-static /var/www
RUN mkdir -p /var/www/assets
COPY ./logo.svg /var/www/assets