const API_URL = 'http://localhost:8080';

export async function createNFTListing(data) {
  console.log('API çağrısı: POST', `${API_URL}/nft/create`, data);
  
  try {
    const response = await fetch(`${API_URL}/nft/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('API yanıtı:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API hata yanıtı:', errorText);
      throw new Error(`NFT oluşturma başarısız: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('API başarılı yanıt:', result);
    return result;
  } catch (error) {
    console.error('API çağrısı hatası:', error);
    throw error;
  }
}

export async function getActiveListings() {
  console.log('API çağrısı: GET', `${API_URL}/nft/listings`);
  
  try {
    const response = await fetch(`${API_URL}/nft/listings`);

    console.log('API yanıtı:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API hata yanıtı:', errorText);
      throw new Error(`NFT listeleri alınamadı: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('API başarılı yanıt:', result);
    return result;
  } catch (error) {
    console.error('API çağrısı hatası:', error);
    throw error;
  }
}

export async function buyNFT(listingId) {
  console.log('API çağrısı: POST', `${API_URL}/nft/buy/${listingId}`);
  
  try {
    const response = await fetch(`${API_URL}/nft/buy/${listingId}`, {
      method: 'POST',
    });

    console.log('API yanıtı:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API hata yanıtı:', errorText);
      throw new Error(`NFT satın alma başarısız: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('API başarılı yanıt:', result);
    return result;
  } catch (error) {
    console.error('API çağrısı hatası:', error);
    throw error;
  }
} 