import { io } from 'socket.io-client';

const socket = io(null, {
    autoConnect: false,
});

export default socket;