'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import nftService from '@/services/nft';
import authService from '@/services/auth';
import walletService from '@/services/wallet';
import '../../styles/Marketplace.css';

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadListings();
    loadCart();
    checkAuth();
  }, []);

  function checkAuth() {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      setTokenBalance(walletService.getBalance());
      
      // İngilizce öğrenme uygulamasından kazanılan tokenleri senkronize et
      try {
        const syncedTokens = walletService.syncTokensFromEliza();
        if (syncedTokens > 0) {
          alert(`${syncedTokens} ET token cüzdanınıza aktarıldı!`);
          setTokenBalance(walletService.getBalance());
        }
      } catch (err) {
        console.error('Token senkronizasyon hatası:', err);
      }
    }
  }

  function loadListings() {
    try {
      const data = nftService.getActiveNFTs();
      setListings(data);
      setError(null);
    } catch (err) {
      setError('NFT listeleri yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function loadCart() {
    const cartItems = nftService.getCart();
    setCart(cartItems);
  }

  function handleAddToCart(nftId) {
    try {
      nftService.addToCart(nftId);
      loadCart();
    } catch (err) {
      alert('Sepete eklenirken bir hata oluştu: ' + err.message);
    }
  }

  function handleRemoveFromCart(nftId) {
    try {
      nftService.removeFromCart(nftId);
      loadCart();
    } catch (err) {
      alert('Sepetten çıkarılırken bir hata oluştu: ' + err.message);
    }
  }

  function handleClearCart() {
    try {
      nftService.clearCart();
      loadCart();
    } catch (err) {
      alert('Sepet temizlenirken bir hata oluştu: ' + err.message);
    }
  }

  function handleCheckout() {
    if (!user) {
      alert('Satın alma işlemi için giriş yapmalısınız.');
      router.push('/login');
      return;
    }
    
    const total = nftService.getCartTotal();
    
    try {
      // Token bakiyesi kontrolü
      if (tokenBalance < total) {
        alert(`Yetersiz token bakiyesi. Mevcut: ${tokenBalance} ET, Gerekli: ${total} ET`);
        return;
      }
      
      // Tokenleri harca
      walletService.spendTokens(total);
      
      // NFT'leri satın al
      const purchasedItems = nftService.purchaseCart(user.id);
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
      setTokenBalance(walletService.getBalance());
      
      // Sepeti güncelle
      loadCart();
      
      // Başarılı mesajı göster
      alert(`${purchasedItems.length} NFT başarıyla satın alındı! Siparişlerinizi 'Siparişlerim' sayfasından görüntüleyebilirsiniz.`);
      
      // Siparişlerim sayfasına yönlendir
      router.push('/orders');
    } catch (err) {
      alert('Satın alma işlemi sırasında bir hata oluştu: ' + err.message);
    }
  }

  function handleLogin() {
    router.push('/login');
  }

  function handleLogout() {
    authService.logout();
    setUser(null);
    setTokenBalance(0);
  }

  return (
    <div className="page">
      <main className="container">
        <div className="marketplace">
          <div className="marketplace-header">
            <h1>NFT Marketplace</h1>
            <div className="user-actions">
              {user ? (
                <div className="user-info">
                  <span className="token-balance">
                    <img src="/et-token.svg" alt="ET Token" className="token-icon" />
                    {tokenBalance} ET
                  </span>
                  <span className="username">Merhaba, {user.username}</span>
                  <button className="btn btn-secondary" onClick={() => router.push('/orders')}>
                    Siparişlerim
                  </button>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleLogin}>
                  Giriş Yap
                </button>
              )}
              <button 
                className="btn btn-cart"
                onClick={() => setIsCartOpen(true)}
              >
                Sepet ({cart.length})
              </button>
            </div>
          </div>

          <div className="marketplace-info">
            <p>İngilizce öğrenme uygulamasında kazandığınız ET tokenleri ile NFT'leri satın alabilirsiniz.</p>
          </div>

          {loading ? (
            <div className="loading">Yükleniyor...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="nft-grid">
              {listings.map(nft => (
                <div key={nft.id} className="nft-card">
                  <Link href={`/marketplace/${nft.id}`} className="nft-link">
                    <div className="nft-image">
                      <img src={nft.image} alt={nft.name} />
                    </div>
                    <div className="nft-info">
                      <h3>{nft.name}</h3>
                      <p className="nft-description">{nft.description}</p>
                      <p className="nft-price">
                        <img src="/et-token.svg" alt="ET Token" className="token-icon-small" />
                        {nft.price} ET
                      </p>
                    </div>
                  </Link>
                  <button 
                    className="btn btn-primary btn-full"
                    onClick={() => handleAddToCart(nft.id)}
                  >
                    Sepete Ekle
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isCartOpen && (
          <div className="cart-modal">
            <div className="cart-content">
              <div className="cart-header">
                <h2>Sepetim</h2>
                <button className="cart-close" onClick={() => setIsCartOpen(false)}>&times;</button>
              </div>
              
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <p>Sepetiniz boş</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <p className="cart-item-price">
                            <img src="/et-token.svg" alt="ET Token" className="token-icon-small" />
                            {item.price} ET
                          </p>
                        </div>
                        <button 
                          className="btn btn-remove"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Toplam:</span>
                      <span className="cart-total-price">
                        <img src="/et-token.svg" alt="ET Token" className="token-icon-small" />
                        {nftService.getCartTotal()} ET
                      </span>
                    </div>
                    
                    <div className="cart-actions">
                      <button 
                        className="btn btn-outline"
                        onClick={handleClearCart}
                      >
                        Sepeti Temizle
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={handleCheckout}
                      >
                        Satın Al
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 