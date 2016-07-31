FROM pritunl/archlinux:latest
MAINTAINER Jakub Fedyczak <jakub@fedyczak.net>

# Set the time zone
RUN rm /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Warsaw /etc/localtime

# Add polish locale
RUN echo "pl_PL.UTF-8 UTF-8" >> /etc/locale.gen && locale-gen

# Exposed ports
EXPOSE 5432

# Default command
CMD ["postgres", "-D", "/var/lib/postgres/data"]

# Install packages
RUN pacman --noconfirm -S postgresql

# Create missing folders and fix permissions
RUN mkdir /run/postgresql && chown postgres /run/postgresql && chown postgres /var/lib/postgres

# Database cluster init with postgres/postgres credentials
USER postgres
RUN echo "postgres" > /tmp/pgpw && initdb --pwfile /tmp/pgpw --locale pl_PL.UTF-8 -E UTF8 -D '/var/lib/postgres/data' && rm /tmp/pgpw

# Listen on all interfaces - required for outside access
RUN echo "listen_addresses = '*'" >> /var/lib/postgres/data/postgresql.conf

# Allow remote login
RUN echo "host thedb thedb 0.0.0.0/0 md5" >> /var/lib/postgres/data/pg_hba.conf

# Create initial database
RUN printf "CREATE USER thedb WITH PASSWORD 'thedb';\nCREATE DATABASE thedb OWNER thedb ENCODING 'UTF8';\nGRANT ALL PRIVILEGES ON DATABASE thedb to thedb;\n" | postgres --single -D /var/lib/postgres/data template1

# Install extensions
RUN printf "CREATE EXTENSION pgcrypto;\nCREATE EXTENSION pg_trgm;\n" | postgres --single -D /var/lib/postgres/data thedb

# Volumes
VOLUME /var/lib/postgres
