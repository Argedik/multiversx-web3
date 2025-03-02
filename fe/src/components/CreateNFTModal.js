'use client';

import { useState } from 'react';
import { createNFTListing } from '@/services/api';

export function CreateNFTModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    tokenId: '',
    contractAddress: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      token_id: formData.tokenId,
      contract_address: formData.contractAddress,
      price: formData.price,
    };

    console.log('NFT oluşturma isteği gönderiliyor:', data);

    try {
      const result = await createNFTListing(data);
      console.log('NFT başarıyla oluşturuldu:', result);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('NFT oluşturma hatası:', err);
      setError('NFT oluşturulurken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>NFT Oluştur</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form className="modal-content" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="tokenId">Token ID</label>
            <input 
              type="text" 
              id="tokenId" 
              className="input"
              value={formData.tokenId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contractAddress">Contract Address</label>
            <input 
              type="text" 
              id="contractAddress" 
              className="input"
              value={formData.contractAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Fiyat (ETH)</label>
            <input 
              type="number" 
              id="price" 
              className="input" 
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">NFT Görseli</label>
            <input type="file" id="image" className="input" accept="image/*" />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn" 
              onClick={onClose}
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 