FROM rust:1.86-slim AS builder

WORKDIR /app
COPY . .

# Build only the api-server binary
RUN cargo build --release -p api-server

# Final image
FROM debian:bookworm-slim

# Copy the compiled binary
COPY --from=builder /app/target/release/api-server /usr/local/bin/api-server

# Expose the port your app runs on
EXPOSE 8083

CMD ["api-server"]
