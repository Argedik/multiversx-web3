import React, { useState, useEffect, useRef } from 'react';
import elizaService from '../services/eliza';
import '../styles/ElizaChat.css';

const ElizaChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [tokens, setTokens] = useState(0);
  const messagesEndRef = useRef(null);

  // Sayfa yüklendiğinde ilk mesajı göster
  useEffect(() => {
    addMessage('bot', elizaService.getInitialGreeting());
  }, []);

  // Mesajlar güncellendiğinde otomatik olarak en alta kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Token bakiyesini güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(elizaService.getTokenBalance());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (sender, text) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Kullanıcı mesajını ekle
    addMessage('user', input);

    // Eliza'nın yanıtını al
    const response = elizaService.processUserInput(input);
    
    // Eliza'nın yanıtını ekle
    setTimeout(() => {
      addMessage('bot', response);
    }, 500);

    // Input'u temizle
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="token-display">
        <img src="/et-token.png" alt="ET Token" className="token-icon" />
        <span>{tokens} ET</span>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Gönder</button>
      </form>
    </div>
  );
};

export default ElizaChat; 