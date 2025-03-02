use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub address: String,
    pub nonce: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub address: String,
    pub exp: usize,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/nonce", web::get().to(get_nonce))
            .route("/verify", web::post().to(verify_signature))
    );
}

async fn get_nonce() -> impl Responder {
    let nonce = uuid::Uuid::new_v4().to_string();
    HttpResponse::Ok().json(serde_json::json!({ "nonce": nonce }))
}

async fn verify_signature(_signature: web::Json<serde_json::Value>) -> impl Responder {
    // Burada imza doğrulaması yapılacak
    HttpResponse::Ok().json(serde_json::json!({ "token": "dummy_token" }))
} 