use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use dotenv::dotenv;
use crate::db::DbClient;

mod auth;
mod blockchain;
mod db;
mod nft;
mod api;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let db_client = DbClient::new().expect("Failed to initialize Supabase client");
    let db_data = web::Data::new(db_client);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(db_data.clone())
            .configure(auth::config)
            .configure(blockchain::config)
            .configure(nft::config)
            .configure(api::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
