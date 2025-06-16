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
use core::{process_xes_classification, process_matrix_classification, MatrixRustIncoming};

#[derive(Deserialize)]
struct Thresholds {
    existential_threshold: f64,
    temporal_threshold: f64,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

async fn upload(mut multipart: Multipart) -> Result<Json<String>, String> {
    let mut content = None;
    let mut existential_threshold = None;
    let mut temporal_threshold = None;

    while let Some(field) = multipart.next_field().await.map_err(|e| e.to_string())? {
        match field.name() {
            Some("file") => {
                content = Some(field.text().await.map_err(|e| format!("Failed to read file: {}", e))?);
            }
            Some("existential_threshold") => {
                let value = field.text().await.map_err(|e| e.to_string())?;
                existential_threshold = value.parse::<f64>().ok();
            }
            Some("temporal_threshold") => {
                let value = field.text().await.map_err(|e| e.to_string())?;
                temporal_threshold = value.parse::<f64>().ok();
            }
            _ => {}
        }
    }

    let content = content.ok_or("Missing 'file' field")?;
    let existential_threshold = existential_threshold.ok_or("Missing or invalid 'existential_threshold'")?;
    let temporal_threshold = temporal_threshold.ok_or("Missing or invalid 'temporal_threshold'")?;

    match process_xes_classification(&content, existential_threshold, temporal_threshold) {
        Ok(classification) => Ok(Json(classification)),
        Err(e) => Err(format!("Processing error: {}", e)),
    }
}

async fn classify_matrix(Json(payload): Json<MatrixRustIncoming>) -> Result<Json<String>, (StatusCode, Json<ErrorResponse>)> {
    match process_matrix_classification(payload) {
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
        .route("/algo", post(upload))
        .route("/algo/matrix", post(classify_matrix))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8082));
    println!("Listening on {}", addr);

    let listener = TcpListener::bind(&addr).await.expect("Failed to bind");
    
    let make_service = app.into_make_service();
    axum::serve(listener, make_service).await.unwrap();
}