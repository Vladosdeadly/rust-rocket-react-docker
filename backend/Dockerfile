FROM rustlang/rust:nightly-slim AS build
WORKDIR /home/rust

RUN apt-get update && apt-get install -y libssl-dev pkg-config && rustup update

RUN cargo new --bin backend
WORKDIR /home/rust/backend

COPY Cargo.toml Cargo.lock ./
RUN cargo build --locked --release

RUN rm src/*.rs target/release/deps/backend*
COPY src ./src
RUN cargo install --locked --path .

FROM debian:bullseye

COPY --from=build /usr/local/cargo/bin/backend /backend

EXPOSE 8000
ENV ROCKET_ADDRESS 0.0.0.0
ENV ROCKET_PORT 8000

CMD ["./backend"]