FROM node:18-alpine3.17


# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app/

# Installing dependencies
COPY package.json /app/
COPY yarn.lock /app/
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN yarn install --production=false

# Copying source files
COPY . /app/

# Building app
RUN yarn build:dev

EXPOSE 3000
# Running the app
CMD ["yarn", "serve", "--host"]
