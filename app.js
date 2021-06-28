const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./util/messages');
const { userJoin, getCurrentUser,userLeave,getRoomUsers } = require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chit-Chat Bot';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        //welcome new user
    socket.emit('message', formatMessage(botName,'Welcome to Chit-Chat!')); //only to the connecting user

        //broadcast when a user connects to all except the connecting user
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        

    });
    
    
    //runs when a user disconnects
    socket.on('disconnect', () => {
        
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            
            //send users and room info
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        }
        
    });


    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

    
});

const port =  process.env.PORT || 3000;
server.listen(port, () => console.log('server running on port' + port));