import Head from 'next/head';
    import { useState, useEffect, useRef } from 'react';
    import io from 'socket.io-client';

    const socket = io('http://localhost:3000'); // Server adresini ayarlayın

    export default function Home() {
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState('');
      const messagesEndRef = useRef(null);

      useEffect(() => {
        socket.on('connect', () => {
          console.log('Socket connected');
        });

        socket.on('message', (message) => {
          setMessages([...messages, message]);
        });

        return () => {
          socket.disconnect();
        };
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
          socket.emit('message', newMessage);
          setNewMessage('');
        }
      };

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

      return (
        <div className="container">
          <Head>
            <title>Sohbet SaaS</title>
            <meta name="description" content="Sohbet tabanlı SaaS projesi" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className="main">
            <h1>Sohbet SaaS</h1>

            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  {message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
              />
              <button type="submit">Gönder</button>
            </form>
          </main>
        </div>
      );
    }
