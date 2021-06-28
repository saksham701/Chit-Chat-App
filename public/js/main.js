const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chatroom
socket.emit('joinRoom', { username, room });

//get room and users 
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

console.log(username, room);
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    //scroll down
});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //getting text of message from input field
    const msgFromUser = e.target.elements.msg.value;

    //emmiting message to server
    socket.emit('chatMessage', msgFromUser);

     //clear input 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//output message to dom

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);

   
}

//output room name to dom
function outputRoomName(room) {
    roomName.innerText = room;

}

//output users to dom

function outputRoomUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}