FROM php:8.2-apache
RUN docker-php-ext-install pdo pdo_mysql mysqli 
COPY ./.env /var/www/html/.env
RUN chmod 644 /var/www/html/.env
ENV USERNAME_PHPMAILER=ae25c24ea73c55
ENV SENHA_PHPMAILER=c4a8334b81329a