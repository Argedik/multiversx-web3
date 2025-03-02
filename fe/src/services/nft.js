// NFT mağazası için örnek veriler ve servisler
import authService from './auth';

// localStorage'a güvenli erişim için yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

const getLocalStorage = (key) => {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key, value) => {
  if (isBrowser()) {
    localStorage.setItem(key, value);
  }
};

// Örnek NFT'ler
const sampleNFTs = [
  {
    id: '1',
    name: 'İngilizce Öğrenme Sertifikası - Başlangıç',
    description: 'İngilizce öğrenme yolculuğunuzda başlangıç seviyesini tamamladığınızı gösteren özel NFT.',
    image: 'https://picsum.photos/200/200',
    price: 50, // ET token fiyatı
    tokenId: 'ETCERT001',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    seller: 'system',
    isActive: true
  },
  {
    id: '2',
    name: 'İngilizce Öğrenme Sertifikası - Orta',
    description: 'İngilizce öğrenme yolculuğunuzda orta seviyeyi tamamladığınızı gösteren özel NFT.',
    image: 'https://picsum.photos/200/200',
    price: 100, // ET token fiyatı
    tokenId: 'ETCERT002',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345679',
    seller: 'system',
    isActive: true
  },
  {
    id: '3',
    name: 'İngilizce Öğrenme Sertifikası - İleri',
    description: 'İngilizce öğrenme yolculuğunuzda ileri seviyeyi tamamladığınızı gösteren özel NFT.',
    image: 'https://picsum.photos/200/200',
    price: 200, // ET token fiyatı
    tokenId: 'ETCERT003',
    contractAddress: '0x1234567890abcdef1234567890abcdef1234567a',
    seller: 'system',
    isActive: true
  },
  {
    id: '4',
    name: 'İngilizce Konuşma Kulübü Üyeliği',
    description: 'Özel İngilizce konuşma kulübüne 1 aylık üyelik sağlayan NFT.',
    image: 'https://picsum.photos/200/200',
    price: 150, // ET token fiyatı
    tokenId: 'ETCLUB001',
    contractAddress: '0x1234567890abcdef1234567890abcdef1234567b',
    seller: 'system',
    isActive: true
  },
  {
    id: '5',
    name: 'İngilizce Özel Ders Paketi',
    description: '5 saatlik özel İngilizce ders paketi sağlayan NFT.',
    image: 'https://picsum.photos/200/200',
    price: 300, // ET token fiyatı
    tokenId: 'ETLESSON001',
    contractAddress: '0x1234567890abcdef1234567890abcdef1234567c',
    seller: 'system',
    isActive: true
  }
];

// LocalStorage'dan NFT'leri yükle veya örnek verileri kullan
const loadNFTs = () => {
  const storedNFTs = getLocalStorage('nfts');
  if (storedNFTs) {
    return JSON.parse(storedNFTs);
  }
  
  // İlk kez çalıştırılıyorsa örnek verileri kaydet
  if (isBrowser()) {
    setLocalStorage('nfts', JSON.stringify(sampleNFTs));
  }
  return sampleNFTs;
};

// Sepet işlemleri
class NFTService {
  constructor() {
    this.nfts = loadNFTs();
    this.cart = JSON.parse(getLocalStorage('cart') || '[]');
  }

  // Tüm NFT'leri getir
  getAllNFTs() {
    return this.nfts;
  }

  // Aktif NFT'leri getir
  getActiveNFTs() {
    return this.nfts.filter(nft => nft.isActive);
  }

  // NFT detaylarını getir
  getNFTById(id) {
    return this.nfts.find(nft => nft.id === id);
  }

  // Sepete NFT ekle
  addToCart(nftId) {
    const nft = this.getNFTById(nftId);
    if (!nft) {
      throw new Error('NFT bulunamadı');
    }
    
    // Sepette zaten varsa ekleme
    if (this.cart.some(item => item.id === nftId)) {
      return this.cart;
    }
    
    this.cart.push(nft);
    setLocalStorage('cart', JSON.stringify(this.cart));
    return this.cart;
  }

  // Sepetten NFT çıkar
  removeFromCart(nftId) {
    this.cart = this.cart.filter(item => item.id !== nftId);
    setLocalStorage('cart', JSON.stringify(this.cart));
    return this.cart;
  }

  // Sepeti getir
  getCart() {
    return this.cart;
  }

  // Sepeti temizle
  clearCart() {
    this.cart = [];
    setLocalStorage('cart', JSON.stringify(this.cart));
    return this.cart;
  }

  // Sepet toplamını hesapla
  getCartTotal() {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  // NFT satın al
  purchaseNFT(nftId, userId) {
    const nft = this.getNFTById(nftId);
    if (!nft) {
      throw new Error('NFT bulunamadı');
    }
    
    // NFT'yi satın alındı olarak işaretle
    const updatedNFTs = this.nfts.map(item => {
      if (item.id === nftId) {
        return {
          ...item,
          isActive: false,
          owner: userId
        };
      }
      return item;
    });
    
    this.nfts = updatedNFTs;
    setLocalStorage('nfts', JSON.stringify(this.nfts));
    
    // Sepetten çıkar
    this.removeFromCart(nftId);
    
    return nft;
  }

  // Sepetteki tüm NFT'leri satın al
  purchaseCart(userId) {
    if (this.cart.length === 0) {
      throw new Error('Sepet boş');
    }
    
    const purchasedItems = [];
    
    // Her bir NFT'yi satın al
    for (const item of this.cart) {
      const purchasedItem = this.purchaseNFT(item.id, userId);
      purchasedItems.push(purchasedItem);
    }
    
    // Sipariş oluştur
    const order = {
      date: new Date().toISOString(),
      items: [...purchasedItems],
    };
    
    // Kullanıcının siparişlerine ekle
    authService.addOrder(order);
    
    // Sepeti temizle
    this.clearCart();
    
    return purchasedItems;
  }
}

export default new NFTService();