-- Önce mevcut tabloyu silelim
DROP TABLE IF EXISTS nft_listings;

-- Sonra doğru veri tipiyle yeniden oluşturalım
CREATE TABLE nft_listings (
  id TEXT PRIMARY KEY,  -- UUID'yi TEXT olarak saklayacağız
  token_id TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  price TEXT NOT NULL,
  seller TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikalarını ayarlayalım
ALTER TABLE nft_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read nft_listings" ON nft_listings FOR SELECT USING (true);
CREATE POLICY "Service can insert nft_listings" ON nft_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update nft_listings" ON nft_listings FOR UPDATE USING (true); 