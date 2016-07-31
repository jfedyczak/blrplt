FROM pritunl/archlinux:latest
MAINTAINER Jakub Fedyczak <jakub@fedyczak.net>

# Set the time zone
RUN rm /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Warsaw /etc/localtime

# Add polish locale
RUN echo "pl_PL.UTF-8 UTF-8" >> /etc/locale.gen && locale-gen

# Exposed ports
EXPOSE 3001

# This is for dev version
CMD ["/bin/bash", "-c", "sleep 3650d"]

# Install packages
RUN pacman --noconfirm -S icu python2 base-devel postgresql git libsass vi 

# Install node.js LTS from AUR

# Create nodeapp user
RUN useradd -m -s /bin/bash temp

# Install nodejs LTS
RUN su - temp -c "curl -O  https://aur.archlinux.org/cgit/aur.git/snapshot/nodejs-lts-argon.tar.gz"
RUN su - temp -c "tar -xzf nodejs-lts-argon.tar.gz"
RUN su - temp -c "cd nodejs-lts-argon && makepkg"
RUN su - temp -c "mv nodejs-lts-argon/nodejs*.xz n.xz"
RUN pacman --noconfirm -U /home/temp/n.xz

RUN userdel -r temp

RUN pacman --noconfirm -S npm 

# Install global node tools
RUN npm install -g gulp

# Create nodeapp user
RUN useradd -m -s /bin/bash app

# Create node_modules folder
RUN mkdir -p /home/app/src/node_modules
RUN chown -R app:app /home/app/src
WORKDIR /home/app/src
USER app
RUN echo "export TERM=xterm-color" >> /home/app/.bashrc
