-- Önce mevcut politikaları kaldıralım
DROP POLICY IF EXISTS "Anyone can read nft_listings" ON nft_listings;
DROP POLICY IF EXISTS "Service can insert nft_listings" ON nft_listings;
DROP POLICY IF EXISTS "Service can update nft_listings" ON nft_listings;
DROP POLICY IF EXISTS "Unrestricted policy" ON nft_listings;

-- RLS'yi tamamen devre dışı bırakalım
ALTER TABLE nft_listings DISABLE ROW LEVEL SECURITY;

-- Tüm kullanıcıların tablo üzerinde işlem yapabilmesi için
-- Eğer RLS'yi tekrar etkinleştirmek istersek:
-- ALTER TABLE nft_listings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Unrestricted policy" ON nft_listings USING (true) WITH CHECK (true); 