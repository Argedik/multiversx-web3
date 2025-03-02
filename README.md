# İngilizce Öğrenme Platformu ve NFT Marketplace

Bu proje, MultiversX blockchain teknolojisi kullanılarak geliştirilmiş bir İngilizce öğrenme platformu ve NFT marketplace uygulamasıdır. Kullanıcılar, Eliza framework'ü benzeri bir yapay zeka asistanı ile İngilizce öğrenebilir, doğru cevaplar vererek ET (English Token) kazanabilir ve bu tokenleri NFT marketplace'te harcayabilirler.

## Proje Özellikleri

### İngilizce Öğrenme Platformu (Eliza)

- **Seviye Belirleme**: Kullanıcıların İngilizce seviyesini belirlemek için 5 değerlendirme sorusu
- **Kişiselleştirilmiş Öğrenme**: Kullanıcının seviyesine uygun sorular (Başlangıç, Orta, İleri)
- **Token Ekonomisi**: Doğru cevaplar için ET token ödülleri
  - Her doğru cevap için 1 ET token
  - Her 10 doğru cevap için ekstra 10 ET token
- **İlerleme Takibi**: Kullanıcının öğrenme sürecini ve kazandığı tokenleri takip etme

### NFT Marketplace

- **NFT Listeleme**: İngilizce öğrenme sertifikaları ve özel ders paketleri gibi NFT'ler
- **Sepet İşlemleri**: NFT'leri sepete ekleme, çıkarma ve satın alma
- **Token Entegrasyonu**: ET tokenler ile NFT satın alma
- **Sipariş Yönetimi**: Satın alınan NFT'lerin siparişler sayfasında görüntülenmesi

### Kullanıcı Yönetimi

- **Kayıt ve Giriş**: Kullanıcı hesabı oluşturma ve giriş yapma
- **Cüzdan Entegrasyonu**: ET token bakiyesi görüntüleme ve yönetme
- **Token Senkronizasyonu**: İngilizce öğrenme platformunda kazanılan tokenlerin NFT marketplace'e aktarılması

## Teknolojik Altyapı

- **Frontend**: Next.js, React
- **Veri Saklama**: LocalStorage (demo amaçlı)
- **Blockchain Entegrasyonu**: MultiversX blockchain (simüle edilmiş)
- **Yapay Zeka**: Eliza framework benzeri bir asistan (simüle edilmiş)

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum Adımları

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/kullanici/ingilizce-ogrenme-nft.git
   cd ingilizce-ogrenme-nft
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   cd fe
   npm install
   # veya
   yarn install
   ```

3. Uygulamayı çalıştırın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

4. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı kullanmaya başlayın.

## Kullanım Kılavuzu

### İngilizce Öğrenme Platformu

1. Ana sayfada "İngilizce Öğrenme" kartına tıklayın.
2. Yapay zeka asistanı ET ile tanışın ve adınızı girin.
3. Seviye belirleme sorularını cevaplayın.
4. Seviyenize uygun İngilizce sorularını cevaplayarak ET token kazanın.

### NFT Marketplace

1. Ana sayfada "NFT Marketplace" kartına tıklayın.
2. Mevcut NFT'leri görüntüleyin ve ilgilendiğiniz NFT'leri sepete ekleyin.
3. Sepet simgesine tıklayarak sepetinizi görüntüleyin.
4. "Satın Al" butonuna tıklayarak, kazandığınız ET tokenler ile NFT'leri satın alın.
5. Satın aldığınız NFT'leri "Siparişlerim" sayfasında görüntüleyin.

## Proje Yapısı

```
fe/
├── public/
│   ├── et-token.svg
│   └── nft-images/
├── src/
│   ├── app/
│   │   ├── marketplace/
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   ├── orders/
│   │   │   └── page.js
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── register/
│   │   │   └── page.js
│   │   └── page.js
│   ├── services/
│   │   ├── auth.js
│   │   ├── eliza.js
│   │   ├── nft.js
│   │   └── wallet.js
│   └── styles/
│       ├── Marketplace.css
│       ├── NFTDetail.css
│       └── Orders.css
└── package.json
```

## Notlar

- Bu proje şu an için tamamen frontend odaklı olup, verileri localStorage'da saklamaktadır.
- Gerçek bir uygulamada, MultiversX blockchain ile tam entegrasyon ve güvenli bir backend yapısı gerekecektir.
- Eliza framework'ü simüle edilmiş olup, gerçek uygulamada MultiversX AI Agent Kit ve Eliza Framework kullanılabilir.

## Gelecek Geliştirmeler

- MultiversX blockchain ile tam entegrasyon
- Gerçek NFT mint etme ve transfer işlemleri
- Daha gelişmiş yapay zeka asistanı
- Kullanıcı profili ve ilerleme istatistikleri
- Mobil uygulama desteği

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

Sorularınız veya önerileriniz için [email@example.com](mailto:email@example.com) adresine e-posta gönderebilirsiniz. 