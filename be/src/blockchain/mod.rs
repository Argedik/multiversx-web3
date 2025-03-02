use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TransferRequest {
    pub to: String,
    pub amount: String,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/blockchain")
            .route("/balance/{address}", web::get().to(get_balance))
            .route("/transfer", web::post().to(transfer_tokens))
    );
}

async fn get_balance(_address: web::Path<String>) -> impl Responder {
    // Burada bakiye sorgulanacak
    HttpResponse::Ok().json(serde_json::json!({ "balance": "0" }))
}

async fn transfer_tokens(_transfer: web::Json<TransferRequest>) -> impl Responder {
    // Burada token transferi yapılacak
    HttpResponse::Ok().json(serde_json::json!({ "status": "success" }))
} 