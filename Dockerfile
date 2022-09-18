FROM node:16-alpine as deps
WORKDIR /usr/cache/src/app
COPY package.json ./
# COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/var/cache/yarn --mount=type=cache,target=/var/cache/yarn/build yarn add sharp@0.30.3

FROM node:16-alpine as builder

WORKDIR /usr/src/app
ARG ECOM_BUILD_STAGE

COPY . .
# Copy node_modules from cache
COPY --from=deps /usr/cache/src/app/node_modules ./node_modules

# Building app
RUN echo $ECOM_BUILD_STAGE
RUN yarn $ECOM_BUILD_STAGE

FROM node:16-alpine as runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/next.config.js ./next.config.js
COPY --from=builder /usr/src/app/server.js ./server.js
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 80

# start app
CMD ["yarn","start"]
