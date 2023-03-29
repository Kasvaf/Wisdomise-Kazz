FROM node:18-alpine3.17


# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app/

# Installing dependencies
COPY package*.json /app/
ENV NODE_OPTIONS=--max_old_space_size=8192
RUN npm install

# Copying source files
COPY . /app/

# Building app
RUN npm run build:prod

EXPOSE 3000
# Running the app
CMD [ "npm","run", "serve"]
