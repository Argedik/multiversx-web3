'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/auth';
import walletService from '@/services/wallet';
import '../../styles/Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData.username, formData.password);
      
      // İngilizce öğrenme uygulamasından kazanılan tokenleri senkronize et
      try {
        const syncedTokens = walletService.syncTokensFromEliza();
        if (syncedTokens > 0) {
          alert(`${syncedTokens} ET token cüzdanınıza aktarıldı!`);
        }
      } catch (err) {
        console.error('Token senkronizasyon hatası:', err);
      }
      
      // Başarılı kayıt sonrası yönlendirme
      router.push('/marketplace');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <main className="container">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Kayıt Ol</h1>
            
            {error && <div className="auth-error">{error}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Kullanıcı Adı</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Şifre</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Şifre Tekrar</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </button>
            </form>
            
            <div className="auth-links">
              <p>
                Zaten hesabınız var mı? <Link href="/login">Giriş Yap</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
 