FROM node:latest

RUN echo alias ll='ls -al --colo=auto'  root.bashrc
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package.json .
RUN npm install

COPY . .


EXPOSE 8815

CMD [npm, start]
