'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/auth';
import walletService from '@/services/wallet';
import '../../styles/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  function checkAuth() {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      router.push('/login');
      return;
    }
    
    setUser(currentUser);
    setTokenBalance(walletService.getBalance());
    
    // Kullanıcının siparişlerini yükle
    loadOrders(currentUser);
  }

  function loadOrders(user) {
    try {
      // Kullanıcının siparişlerini al
      const userOrders = user.orders || [];
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      setError('Siparişler yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    authService.logout();
    router.push('/marketplace');
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

  return (
    <div className="page">
      <main className="container">
        <div className="orders">
          <div className="orders-header">
            <h1>Siparişlerim</h1>
            <div className="user-actions">
              {user && (
                <div className="user-info">
                  <span className="token-balance">
                    <img src="/et-token.svg" alt="ET Token" className="token-icon" />
                    {tokenBalance} ET
                  </span>
                  <span className="username">Merhaba, {user.username}</span>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Çıkış Yap
                  </button>
                </div>
              )}
              <Link href="/marketplace" className="btn btn-primary">
                Marketplace'e Dön
              </Link>
            </div>
          </div>

          {error ? (
            <div className="error">{error}</div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <p>Henüz hiç siparişiniz bulunmuyor.</p>
              <Link href="/marketplace" className="btn btn-primary">
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, index) => (
                <div key={index} className="order-card">
                  <div className="order-header">
                    <h3>Sipariş #{index + 1}</h3>
                    <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="order-item">
                        <img src={item.image} alt={item.name} className="order-item-image" />
                        <div className="order-item-info">
                          <h4>{item.name}</h4>
                          <p className="order-item-price">
                            <img src="/et-token.svg" alt="ET Token" className="token-icon-small" />
                            {item.price} ET
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Toplam:</span>
                      <span className="order-total-price">
                        <img src="/et-token.svg" alt="ET Token" className="token-icon-small" />
                        {order.items.reduce((total, item) => total + item.price, 0)} ET
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 