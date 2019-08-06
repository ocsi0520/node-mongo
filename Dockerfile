FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python
COPY . /usr/src/app
# COPY package.json /usr/src/app/
RUN npm install
RUN npm rebuild bcrypt --update-binary
EXPOSE 3000
CMD ["npm","start"]