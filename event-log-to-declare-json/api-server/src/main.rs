use axum::{
    extract::Multipart,
    routing::post,
    Json, Router,
    http::StatusCode
};
use tower_http::cors::{CorsLayer, Any};
use serde::{Serialize, Deserialize};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use core::{MatrixRustIncoming, process_matrix_declare, DeclareModel};

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

async fn declare_matrix(Json(payload): Json<MatrixRustIncoming>) -> Result<Json<String>, (StatusCode, Json<ErrorResponse>)> {
    match process_matrix_declare(payload) {
        Ok(result) => Ok(Json(result)),
        Err(e) => Err((
            StatusCode::UNPROCESSABLE_ENTITY,
            Json(ErrorResponse {
                error: format!("Processing error: {}", e),
            }),
        )),
    }
}

#[tokio::main]
async fn main() {
    
    let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);
    
    let app = Router::new()
        .route("/algo", post(declare_matrix))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8083));
    println!("Listening on {}", addr);

    let listener = TcpListener::bind(&addr).await.expect("Failed to bind");
    
    let make_service = app.into_make_service();
    axum::serve(listener, make_service).await.unwrap();
}
