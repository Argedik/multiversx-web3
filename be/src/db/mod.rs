use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub enum DbError {
    ReqwestError(reqwest::Error),
    SerdeError(serde_json::Error),
    ApiError(String),
}

impl fmt::Display for DbError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DbError::ReqwestError(e) => write!(f, "Reqwest error: {}", e),
            DbError::SerdeError(e) => write!(f, "Serde error: {}", e),
            DbError::ApiError(e) => write!(f, "API error: {}", e),
        }
    }
}

impl Error for DbError {}

impl From<reqwest::Error> for DbError {
    fn from(err: reqwest::Error) -> Self {
        DbError::ReqwestError(err)
    }
}

impl From<serde_json::Error> for DbError {
    fn from(err: serde_json::Error) -> Self {
        DbError::SerdeError(err)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub wallet_address: String,
    pub nonce: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NFTListing {
    #[serde(deserialize_with = "deserialize_id")]
    pub id: String,
    pub token_id: String,
    pub contract_address: String,
    pub price: String,
    pub seller: String,
    #[serde(deserialize_with = "deserialize_boolean")]
    pub is_active: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
}

// ID'yi hem string hem de sayı olarak kabul edebilen özel deserializer
fn deserialize_id<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: serde::Deserializer<'de>,
{
    struct IdVisitor;

    impl<'de> serde::de::Visitor<'de> for IdVisitor {
        type Value = String;

        fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
            formatter.write_str("string or integer")
        }

        fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            Ok(value.to_string())
        }

        fn visit_string<E>(self, value: String) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            Ok(value)
        }

        fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            Ok(value.to_string())
        }

        fn visit_i64<E>(self, value: i64) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            Ok(value.to_string())
        }
    }

    deserializer.deserialize_any(IdVisitor)
}

// Boolean değeri hem string hem de boolean olarak kabul edebilen özel deserializer
fn deserialize_boolean<'de, D>(deserializer: D) -> Result<bool, D::Error>
where
    D: serde::Deserializer<'de>,
{
    struct BoolVisitor;

    impl<'de> serde::de::Visitor<'de> for BoolVisitor {
        type Value = bool;

        fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
            formatter.write_str("boolean or string representing a boolean")
        }

        fn visit_bool<E>(self, value: bool) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            Ok(value)
        }

        fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            match value.to_lowercase().as_str() {
                "true" => Ok(true),
                "false" => Ok(false),
                _ => Err(E::custom(format!("invalid boolean string: {}", value))),
            }
        }

        fn visit_string<E>(self, value: String) -> Result<Self::Value, E>
        where
            E: serde::de::Error,
        {
            self.visit_str(&value)
        }
    }

    deserializer.deserialize_any(BoolVisitor)
}

pub struct DbClient {
    client: Client,
    url: String,
    api_key: String,
}

impl DbClient {
    pub fn new() -> Result<Self, DbError> {
        let url = std::env::var("SUPABASE_URL").expect("SUPABASE_URL must be set");
        let key = std::env::var("SUPABASE_KEY").expect("SUPABASE_KEY must be set");

        println!("Supabase URL: {}", url);
        println!("Supabase Key (ilk 10 karakter): {}", key.chars().take(10).collect::<String>());

        let client = Client::new();
        Ok(DbClient { client, url, api_key: key })
    }

    pub async fn get_user_by_wallet(&self, wallet_address: &str) -> Result<Option<User>, DbError> {
        let wallet_query = format!("eq.{}", wallet_address);
        let response = self.client
            .get(&format!("{}/rest/v1/users", self.url))
            .header("apikey", &self.api_key)
            .header("Authorization", &format!("Bearer {}", self.api_key))
            .query(&[("wallet_address", wallet_query.as_str()), ("select", "*")])
            .send()
            .await?;
        
        println!("Supabase yanıt durumu (get_user): {}", response.status());
        
        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Hata metni alınamadı".to_string());
            println!("Supabase hata yanıtı: {}", error_text);
            return Err(DbError::ApiError(format!("API error: {} - {}", status, error_text)));
        }
        
        let users: Vec<User> = response.json().await?;
        Ok(users.into_iter().next())
    }

    pub async fn create_user(&self, wallet_address: &str, nonce: &str) -> Result<User, DbError> {
        let user = User {
            id: uuid::Uuid::new_v4().to_string(),
            wallet_address: wallet_address.to_string(),
            nonce: nonce.to_string(),
            created_at: chrono::Utc::now().to_rfc3339(),
        };

        let response = self.client
            .post(&format!("{}/rest/v1/users", self.url))
            .header("apikey", &self.api_key)
            .header("Authorization", &format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .header("Prefer", "return=representation")
            .json(&user)
            .send()
            .await?;
        
        println!("Supabase yanıt durumu (create_user): {}", response.status());
        
        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Hata metni alınamadı".to_string());
            println!("Supabase hata yanıtı: {}", error_text);
            return Err(DbError::ApiError(format!("API error: {} - {}", status, error_text)));
        }
        
        let created_user: User = response.json().await?;
        Ok(created_user)
    }

    pub async fn create_nft_listing(&self, listing: NFTListing) -> Result<NFTListing, DbError> {
        println!("Supabase'e NFT gönderiliyor: {:?}", listing);
        println!("URL: {}/rest/v1/nft_listings", self.url);
        
        let response = self.client
            .post(&format!("{}/rest/v1/nft_listings", self.url))
            .header("apikey", &self.api_key)
            .header("Authorization", &format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .header("Prefer", "return=representation")
            .json(&listing)
            .send()
            .await?;
        
        println!("Supabase yanıt durumu: {}", response.status());
        
        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Hata metni alınamadı".to_string());
            println!("Supabase hata yanıtı: {}", error_text);
            return Err(DbError::ApiError(format!("API error: {} - {}", status, error_text)));
        }
        
        let response_text = response.text().await?;
        println!("Supabase başarılı yanıt: {}", response_text);
        
        match serde_json::from_str::<Vec<NFTListing>>(&response_text) {
            Ok(listings) => {
                if let Some(created) = listings.into_iter().next() {
                    println!("Oluşturulan NFT: {:?}", created);
                    Ok(created)
                } else {
                    println!("Yanıt boş bir liste içeriyor");
                    Err(DbError::ApiError("Yanıt boş bir liste içeriyor".to_string()))
                }
            },
            Err(e1) => {
                println!("Vec<NFTListing> olarak parse edilemedi: {}", e1);
                match serde_json::from_str::<NFTListing>(&response_text) {
                    Ok(created) => {
                        println!("Oluşturulan NFT: {:?}", created);
                        Ok(created)
                    },
                    Err(e2) => {
                        println!("NFTListing olarak da parse edilemedi: {}", e2);
                        Err(DbError::SerdeError(e2))
                    }
                }
            }
        }
    }

    pub async fn get_active_listings(&self) -> Result<Vec<NFTListing>, DbError> {
        let is_active_query = "eq.true";
        let select_query = "*";
        let response = self.client
            .get(&format!("{}/rest/v1/nft_listings", self.url))
            .header("apikey", &self.api_key)
            .header("Authorization", &format!("Bearer {}", self.api_key))
            .query(&[("is_active", is_active_query), ("select", select_query)])
            .send()
            .await?;
        
        println!("Supabase yanıt durumu (listings): {}", response.status());
        
        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Hata metni alınamadı".to_string());
            println!("Supabase hata yanıtı: {}", error_text);
            return Err(DbError::ApiError(format!("API error: {} - {}", status, error_text)));
        }
        
        let response_text = response.text().await?;
        println!("Supabase başarılı yanıt (listings): {}", response_text);
        
        let mut listings_value: serde_json::Value = match serde_json::from_str(&response_text) {
            Ok(val) => val,
            Err(e) => return Err(DbError::SerdeError(e)),
        };
        
        if let serde_json::Value::Array(ref mut items) = listings_value {
            for item in items {
                if let serde_json::Value::Object(ref mut obj) = item {
                    if let Some(id) = obj.get("id") {
                        if let serde_json::Value::Number(num) = id {
                            if let Some(n) = num.as_u64() {
                                obj.insert("id".to_string(), serde_json::Value::String(n.to_string()));
                            }
                        }
                    }
                    
                    if let Some(is_active) = obj.get("is_active") {
                        if let serde_json::Value::String(s) = is_active {
                            if s == "true" {
                                obj.insert("is_active".to_string(), serde_json::Value::Bool(true));
                            } else if s == "false" {
                                obj.insert("is_active".to_string(), serde_json::Value::Bool(false));
                            }
                        }
                    }
                }
            }
        }
        
        match serde_json::from_value::<Vec<NFTListing>>(listings_value) {
            Ok(listings) => {
                println!("Dönüştürülen NFT listesi: {:?}", listings);
                Ok(listings)
            },
            Err(e) => {
                println!("NFTListing listesine dönüştürülemedi: {}", e);
                Err(DbError::SerdeError(e))
            }
        }
    }
}
