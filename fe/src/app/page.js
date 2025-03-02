import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="page">
      <main className="container">
        <div className="grid">
          {/* NFT Marketplace Card */}
          <a href="/marketplace" className="card card-link">
            <h3 className="card-title">NFT Marketplace</h3>
            <p className="card-text">NFT'lerinizi alın, satın ve oluşturun</p>
          </a>

          {/* Token Transfer Card */}
          <a href="/transfer" className="card card-link">
            <h3 className="card-title">Token Transfer</h3>
            <p className="card-text">Token transferlerinizi güvenle gerçekleştirin</p>
          </a>

          {/* AI Integration Card */}
          <a href="/ai" className="card card-link">
            <h3 className="card-title">AI Asistan</h3>
            <p className="card-text">AI destekli özelleştirilmiş öneriler alın</p>
          </a>
          
          {/* English Learning Card */}
          <a href="/english-learning" className="card card-link">
            <h3 className="card-title">İngilizce Öğrenme</h3>
            <p className="card-text">Yapay zeka destekli İngilizce öğrenin ve ET token kazanın</p>
          </a>
        </div>
      </main>
    </div>
  );
}
