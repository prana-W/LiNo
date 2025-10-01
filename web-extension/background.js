import {io} from './lib/socket.io.esm.min.js';
import {SERVER_URL, socketClientOptions} from './constants.js';

const socket = io(SERVER_URL, socketClientOptions);

socket.on("connect", () => {
    console.log('Connected to server!', socket.id);
});

socket.on("connect_error", (error) => {
    console.error('Connection error:', error);
});

socket.on("disconnect", (reason) => {
    console.log('Disconnected:', reason);
});

socket.on('confirmation', (payload) => {

    console.log('Data reached the server!', payload);

})


// setInterval(() => {
//
//     socket.emit('packet', {
//         caption: 'Hello, server! This is a periodic message from the client.',
//         timestamp: new Date().toISOString(),
//         videoUrl: 'google.com'
//     })
//
// }, 5000)