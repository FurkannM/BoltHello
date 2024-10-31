import '../styles/globals.css';
    import { useState, useEffect } from 'react';
    import io from 'socket.io-client';

    const socket = io('http://localhost:3000'); // Server adresini ayarlayın

    function MyApp({ Component, pageProps }) {
      const [connected, setConnected] = useState(false);

      useEffect(() => {
        socket.on('connect', () => {
          setConnected(true);
        });

        socket.on('disconnect', () => {
          setConnected(false);
        });

        return () => {
          socket.disconnect();
        };
      }, []);

      return (
        <>
          {connected && (
            <div className="connected">
              Bağlantı kuruldu!
            </div>
          )}
          <Component {...pageProps} />
        </>
      );
    }

    export default MyApp;
