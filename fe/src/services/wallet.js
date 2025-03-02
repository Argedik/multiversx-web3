// Token cüzdanı servisi
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

class WalletService {
  // Cüzdan bakiyesini getir
  getBalance() {
    const user = authService.getCurrentUser();
    if (!user) {
      return 0;
    }
    
    return user.tokens || 0;
  }

  // Token ekle
  addTokens(amount) {
    if (!authService.isLoggedIn()) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    return authService.addTokens(amount);
  }

  // Token harca
  spendTokens(amount) {
    if (!authService.isLoggedIn()) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    const balance = this.getBalance();
    if (balance < amount) {
      throw new Error(`Yetersiz token bakiyesi. Mevcut: ${balance}, Gerekli: ${amount}`);
    }
    
    return authService.spendTokens(amount);
  }

  // İngilizce öğrenme uygulamasından kazanılan tokenleri cüzdana aktar
  syncTokensFromEliza() {
    if (!authService.isLoggedIn()) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    // Eliza servisinden token bakiyesini al
    const elizaTokens = getLocalStorage('elizaTokens');
    if (!elizaTokens) {
      return 0;
    }
    
    const tokens = parseInt(elizaTokens, 10);
    if (isNaN(tokens) || tokens <= 0) {
      return 0;
    }
    
    // Tokenleri cüzdana ekle
    authService.addTokens(tokens);
    
    // Eliza token bakiyesini sıfırla
    setLocalStorage('elizaTokens', '0');
    
    return tokens;
  }
}

export default new WalletService(); 