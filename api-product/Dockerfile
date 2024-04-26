# Construction stage
FROM node:21.7.1-alpine AS build

WORKDIR /products

RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm i

COPY . .

ARG DB_CONN_STRING
ARG DB_NAME
ARG REDIS_HOST
ARG REDIS_PORT

ENV DB_CONN_STRING=$DB_CONN_STRING
ENV DB_NAME=$DB_NAME
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT

RUN pnpm run build

# Final stage
FROM node:21.7.1-alpine

RUN apk add --no-cache tini

RUN npm install -g pnpm

WORKDIR /products

# Copy only the files compiled and needed to run the application.
COPY --from=build /products/dist ./dist
COPY --from=build /products/node_modules ./node_modules
COPY --from=build /products/package.json ./package.json

ARG DB_CONN_STRING
ARG DB_NAME
ARG REDIS_HOST
ARG REDIS_PORT

ENV DB_CONN_STRING=$DB_CONN_STRING
ENV DB_NAME=$DB_NAME
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT

ENTRYPOINT ["/sbin/tini", "--"]

CMD [ "pnpm", "run", "start:prod" ]