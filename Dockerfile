FROM node:18 as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . ./
RUN yarn install --immutable
ENV NODE_ENV production
RUN yarn build

FROM scratch
COPY --from=builder /home/node/app/dist /