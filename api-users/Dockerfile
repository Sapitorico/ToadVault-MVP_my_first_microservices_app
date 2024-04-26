# Construction stage
FROM node:21.7.1-alpine AS build

WORKDIR /users

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm i

COPY . .

ARG DB_CONN_STRING
ARG DB_NAME
ARG CLIENT_ID
ARG REDIS_HOST
ARG REDIS_PORT
ARG GROUP_ID
ARG PASSWORD_SALT
ARG JWT_SECRET

ENV DB_CONN_STRING=$DB_CONN_STRING
ENV DB_NAME=$DB_NAME
ENV CLIENT_ID=$CLIENT_ID
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV GROUP_ID=$GROUP_ID
ENV PASSWORD_SALT=$PASSWORD_SALT
ENV JWT_SECRET=$JWT_SECRET

RUN pnpm run build

# Final stage
FROM node:21.7.1-alpine

RUN apk add --no-cache tini

RUN npm install -g pnpm

WORKDIR /users

# Copy only the files compiled and needed to run the application.
COPY --from=build /users/dist ./dist
COPY --from=build /users/node_modules ./node_modules
COPY --from=build /users/package.json ./package.json

ARG DB_CONN_STRING
ARG DB_NAME
ARG CLIENT_ID
ARG REDIS_HOST
ARG REDIS_PORT
ARG GROUP_ID
ARG PASSWORD_SALT
ARG JWT_SECRET

ENV DB_CONN_STRING=$DB_CONN_STRING
ENV DB_NAME=$DB_NAME
ENV CLIENT_ID=$CLIENT_ID
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV GROUP_ID=$GROUP_ID
ENV PASSWORD_SALT=$PASSWORD_SALT
ENV JWT_SECRET=$JWT_SECRET

ENTRYPOINT ["/sbin/tini", "--"]

CMD [ "pnpm", "run", "start:prod" ]