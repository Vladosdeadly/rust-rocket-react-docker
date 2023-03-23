# Rust Rocket React Bootstrap Docker MongoDB Atlas Database.
This is a small application with a user registration and verification form + sending confirmation by email, using a mongodb ATLAS cluster
_______________________________________________________________
  Toolchain:
Rust 1.68.0 nightly, Node v16 >= 18, Yarn, Docker-compose.
_______________________________________________________________
  # Install rust:
1. curl https://sh.rustup.rs -sSf | bash -s -- -y
2. curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y
3. rustup toolchain install nightly --allow-downgrade --profile minimal --component clippy
4. rustup default nightly
5. apt-get update && apt-get install -y libssl-dev pkg-config build-essential
_______________________________________________________________
# ATTENTION: before starting, change backend/src/main.rs to your database cluster MongoDB Atlas as well as sending mail
_______________________________________________________________
  Start mode.

1. cargo run  | starting backend
2. cargo build | build on project
_______________________________________________________________
1. yarn install | install all dependencies
2. yarn build   | build on project
3. yarn start   | starting client
_______________________________________________________________
# Docker start app.

docker-compose up -d | build app and starting docker - localhost:3000(front) localhost:8000(back)
