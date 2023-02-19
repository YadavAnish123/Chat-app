const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const users={};
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection',socket=>{
  socket.on('new-user-joined', name=>{
    users[socket.id]=name; 
    socket.broadcast.emit('user-joined',name); 
  });
  socket.on('send',message=>{
    socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
});
socket.on('disconnect',message=>{
  socket.broadcast.emit('left',users[socket.id])
  delete users[socket.id];
});
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
