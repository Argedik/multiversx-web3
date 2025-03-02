'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import nftService from '@/services/nft';
import authService from '@/services/auth';
import walletService from '@/services/wallet';
import '../../../styles/NFTDetail.css';

export default function NFTDetail({ params }) {
  const [nft, setNFT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadNFT();
    checkAuth();
  }, []);

  function checkAuth() {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      setTokenBalance(walletService.getBalance());
    }
  }

  function loadNFT() {
    try {
      const nftData = nftService.getNFTById(params.id);
      if (!nftData) {
        setError('NFT bulunamadı');
      } else {
        setNFT(nftData);
      }
    } catch (err) {
      setError('NFT yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    try {
      nftService.addToCart(nft.id);
      alert('NFT sepete eklendi!');
    } catch (err) {
      alert('Sepete eklenirken bir hata oluştu: ' + err.message);
    }
  }

  function handleBuyNow() {
    if (!user) {
      alert('Satın alma işlemi için giriş yapmalısınız.');
      router.push('/login');
      return;
    }
    
    try {
      // Token bakiyesi kontrolü
      if (tokenBalance < nft.price) {
        alert(`Yetersiz token bakiyesi. Mevcut: ${tokenBalance} ET, Gerekli: ${nft.price} ET`);
        return;
      }
      
      // Tokenleri harca
      walletService.spendTokens(nft.price);
      
      // NFT'yi satın al
      nftService.purchaseNFT(nft.id, user.id);
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
      setTokenBalance(walletService.getBalance());
      
      // Başarılı mesajı göster
      alert('NFT başarıyla satın alındı! Siparişlerinizi "Siparişlerim" sayfasından görüntüleyebilirsiniz.');
      
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

  if (loading) {
    return (
      <div className="page">
        <main className="container">
          <div className="loading">Yükleniyor...</div>
        </main>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="page">
        <main className="container">
          <div className="error">
            <p>{error || 'NFT bulunamadı'}</p>
            <Link href="/marketplace" className="btn btn-primary">
              Marketplace'e Dön
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="container">
        <div className="nft-detail">
          <div className="nft-detail-header">
            <Link href="/marketplace" className="back-link">
              &larr; Marketplace'e Dön
            </Link>
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
                onClick={() => router.push('/marketplace?cart=open')}
              >
                Sepet
              </button>
            </div>
          </div>

          <div className="nft-detail-content">
            <div className="nft-detail-image">
              <img src={nft.image} alt={nft.name} />
            </div>
            <div className="nft-detail-info">
              <h1>{nft.name}</h1>
              <p className="nft-detail-description">{nft.description}</p>
              
              <div className="nft-detail-meta">
                <div className="meta-item">
                  <span className="meta-label">Token ID:</span>
                  <span className="meta-value">{nft.tokenId}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Contract Address:</span>
                  <span className="meta-value">{nft.contractAddress}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Satıcı:</span>
                  <span className="meta-value">{nft.seller}</span>
                </div>
              </div>
              
              <div className="nft-detail-price">
                <span className="price-label">Fiyat:</span>
                <span className="price-value">
                  <img src="/et-token.svg" alt="ET Token" className="token-icon" />
                  {nft.price} ET
                </span>
              </div>
              
              <div className="nft-detail-actions">
                <button 
                  className="btn btn-outline btn-lg"
                  onClick={handleAddToCart}
                >
                  Sepete Ekle
                </button>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleBuyNow}
                >
                  Hemen Satın Al
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 