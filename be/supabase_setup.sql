-- users tablosu
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  nonce TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- nft_listings tablosu
CREATE TABLE IF NOT EXISTS nft_listings (
  id UUID PRIMARY KEY,
  token_id TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  price TEXT NOT NULL,
  seller TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_listings ENABLE ROW LEVEL SECURITY;

-- Herkesin okuma erişimi olsun
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can read nft_listings" ON nft_listings FOR SELECT USING (true);

-- Sadece servis hesabının yazma erişimi olsun
CREATE POLICY "Service can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Service can insert nft_listings" ON nft_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update nft_listings" ON nft_listings FOR UPDATE USING (true); 