// Basit bir kullanıcı kimlik doğrulama servisi
// Gerçek uygulamada daha güvenli bir yöntem kullanılmalıdır

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

const removeLocalStorage = (key) => {
  if (isBrowser()) {
    localStorage.removeItem(key);
  }
};

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // LocalStorage'dan kullanıcı bilgilerini yükle
    this.loadUserFromStorage();
  }

  // Kullanıcı girişi
  login(username, password) {
    // Basit doğrulama - gerçek uygulamada API çağrısı yapılmalıdır
    if (username && password) {
      // Kullanıcı yoksa oluştur
      const existingUsers = JSON.parse(getLocalStorage('users') || '[]');
      let user = existingUsers.find(u => u.username === username);
      
      if (!user) {
        // Yeni kullanıcı oluştur
        user = {
          id: Date.now().toString(),
          username,
          password, // Gerçek uygulamada şifre asla plain text saklanmamalıdır
          tokens: 0,
          orders: []
        };
        
        existingUsers.push(user);
        setLocalStorage('users', JSON.stringify(existingUsers));
      } else {
        // Şifre kontrolü
        if (user.password !== password) {
          throw new Error('Hatalı şifre');
        }
      }
      
      // Kullanıcı bilgilerini sakla
      this.currentUser = {
        id: user.id,
        username: user.username,
        tokens: user.tokens,
        orders: user.orders
      };
      
      this.isAuthenticated = true;
      
      // LocalStorage'a kaydet
      setLocalStorage('currentUser', JSON.stringify(this.currentUser));
      
      return this.currentUser;
    }
    
    throw new Error('Kullanıcı adı ve şifre gereklidir');
  }

  // Kullanıcı çıkışı
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    removeLocalStorage('currentUser');
  }

  // Kullanıcı kaydı
  register(username, password) {
    if (!username || !password) {
      throw new Error('Kullanıcı adı ve şifre gereklidir');
    }
    
    const existingUsers = JSON.parse(getLocalStorage('users') || '[]');
    
    // Kullanıcı adı kontrolü
    if (existingUsers.some(u => u.username === username)) {
      throw new Error('Bu kullanıcı adı zaten kullanılıyor');
    }
    
    // Yeni kullanıcı oluştur
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // Gerçek uygulamada şifre asla plain text saklanmamalıdır
      tokens: 0,
      orders: []
    };
    
    existingUsers.push(newUser);
    setLocalStorage('users', JSON.stringify(existingUsers));
    
    // Otomatik giriş yap
    return this.login(username, password);
  }

  // LocalStorage'dan kullanıcı bilgilerini yükle
  loadUserFromStorage() {
    const storedUser = getLocalStorage('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.isAuthenticated = true;
    }
  }

  // Kullanıcı bilgilerini güncelle
  updateUser(userData) {
    if (!this.currentUser) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    // Kullanıcı bilgilerini güncelle
    this.currentUser = {
      ...this.currentUser,
      ...userData
    };
    
    // LocalStorage'a kaydet
    setLocalStorage('currentUser', JSON.stringify(this.currentUser));
    
    // Kullanıcılar listesini de güncelle
    const existingUsers = JSON.parse(getLocalStorage('users') || '[]');
    const updatedUsers = existingUsers.map(user => {
      if (user.id === this.currentUser.id) {
        return {
          ...user,
          ...userData
        };
      }
      return user;
    });
    
    setLocalStorage('users', JSON.stringify(updatedUsers));
    
    return this.currentUser;
  }

  // Token ekle
  addTokens(amount) {
    if (!this.currentUser) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    const newTokens = (this.currentUser.tokens || 0) + amount;
    return this.updateUser({ tokens: newTokens });
  }

  // Token harca
  spendTokens(amount) {
    if (!this.currentUser) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    if ((this.currentUser.tokens || 0) < amount) {
      throw new Error('Yetersiz token bakiyesi');
    }
    
    const newTokens = this.currentUser.tokens - amount;
    return this.updateUser({ tokens: newTokens });
  }

  // Sipariş ekle
  addOrder(order) {
    if (!this.currentUser) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    
    const orders = [...(this.currentUser.orders || []), order];
    return this.updateUser({ orders });
  }

  // Kullanıcı bilgilerini al
  getCurrentUser() {
    return this.currentUser;
  }

  // Kimlik doğrulama durumunu kontrol et
  isLoggedIn() {
    return this.isAuthenticated;
  }
}

export default new AuthService(); 