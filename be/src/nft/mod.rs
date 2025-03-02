use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use crate::db::{DbClient, NFTListing, DbError};
use rand;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateNFTRequest {
    pub token_id: String,
    pub contract_address: String,
    pub price: String,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/nft")
            .route("/create", web::post().to(create_nft))
            .route("/listings", web::get().to(get_listings))
            .route("/buy/{id}", web::post().to(buy_nft))
    );
}

async fn create_nft(
    db: web::Data<DbClient>,
    nft_data: web::Json<CreateNFTRequest>,
) -> impl Responder {
    println!("NFT oluşturma isteği alındı: {:?}", nft_data);
    
    // Rastgele bir sayı oluşturalım (1 ile 1000000 arasında)
    let random_id = rand::random::<u32>() % 1000000 + 1;
    
    let listing = NFTListing {
        id: random_id.to_string(), // UUID yerine rastgele bir sayı kullanıyoruz
        token_id: nft_data.token_id.clone(),
        contract_address: nft_data.contract_address.clone(),
        price: nft_data.price.clone(),
        seller: "test_seller".to_string(), // Bu kısmı wallet bağlantısından sonra güncelleyeceğiz
        is_active: true,
        created_at: None, // Supabase otomatik olarak oluşturacak
    };

    println!("Oluşturulacak NFT: {:?}", listing);

    match db.create_nft_listing(listing).await {
        Ok(created) => {
            println!("NFT başarıyla oluşturuldu: {:?}", created);
            HttpResponse::Ok().json(created)
        },
        Err(e) => {
            println!("NFT oluşturma hatası: {}", e);
            match e {
                DbError::ReqwestError(re) => {
                    println!("Reqwest hatası detayları: {:?}", re);
                    HttpResponse::InternalServerError().body(format!("NFT oluşturulamadı: Reqwest error: {}", re))
                },
                DbError::SerdeError(se) => {
                    println!("Serde hatası detayları: {:?}", se);
                    HttpResponse::InternalServerError().body(format!("NFT oluşturulamadı: Serde error: {}", se))
                },
                DbError::ApiError(ae) => {
                    println!("API hatası detayları: {}", ae);
                    HttpResponse::InternalServerError().body(format!("NFT oluşturulamadı: API error: {}", ae))
                }
            }
        },
    }
}

async fn get_listings(db: web::Data<DbClient>) -> impl Responder {
    match db.get_active_listings().await {
        Ok(listings) => HttpResponse::Ok().json(listings),
        Err(e) => {
            println!("NFT listeleri alınamadı: {}", e);
            match e {
                DbError::ReqwestError(re) => {
                    println!("Reqwest hatası detayları: {:?}", re);
                    HttpResponse::InternalServerError().body(format!("Listeler alınamadı: Reqwest error: {}", re))
                },
                DbError::SerdeError(se) => {
                    println!("Serde hatası detayları: {:?}", se);
                    HttpResponse::InternalServerError().body(format!("Listeler alınamadı: Serde error: {}", se))
                },
                DbError::ApiError(ae) => {
                    println!("API hatası detayları: {}", ae);
                    HttpResponse::InternalServerError().body(format!("Listeler alınamadı: API error: {}", ae))
                }
            }
        }
    }
}

async fn buy_nft(
    _db: web::Data<DbClient>,
    _listing_id: web::Path<String>,
) -> impl Responder {
    // Burada NFT satın alma işlemi yapılacak
    HttpResponse::Ok().json(serde_json::json!({
        "status": "success",
        "message": "NFT satın alma başarılı"
    }))
} 