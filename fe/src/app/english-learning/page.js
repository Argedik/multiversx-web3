'use client';

import React from 'react';
import ElizaChat from '../../components/ElizaChat';
import '../../styles/EnglishLearning.css';

export default function EnglishLearningPage() {
  return (
    <div className="english-learning-page">
      <div className="header">
        <h1>İngilizce Öğrenme Asistanı</h1>
        <p>MultiversX üzerinde Eliza framework ile geliştirilmiş yapay zeka destekli İngilizce öğrenme platformu</p>
      </div>
      
      <div className="main-content">
        <ElizaChat />
      </div>
      
      <div className="footer">
        <p>Her doğru cevap için 1 ET token kazanırsınız. Her 10 doğru cevap için ekstra 10 ET token kazanırsınız.</p>
      </div>
    </div>
  );
} 