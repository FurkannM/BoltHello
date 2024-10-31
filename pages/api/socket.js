import { Server } from 'socket.io';

    const ioHandler = (req, res) => {
      if (!res.socket.server.io) {
        console.log('Initializing Socket.IO server...');
        const io = new Server(res.socket.server);

        io.on('connection', (socket) => {
          console.log('New socket connection');

          socket.on('message', (message) => {
            io.emit('message', message);
          });

          socket.on('disconnect', () => {
            console.log('Socket disconnected');
          });
        });

        res.socket.server.io = io;
      } else {
        console.log('Socket.IO server already running');
      }
      res.end();
    };

    export const config = {
      api: {
        bodyParser: false,
      },
    };

    export default ioHandler;
