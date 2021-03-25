const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = process.env.PORT || 3000;


var Frame = require('./public/javascripts/Frame');
var imgProcess = require('./public/javascripts/feat');
var jsfeat = require('./public/javascripts/jsfeat');
var frame = new Frame();
const PAT = require('./public/javascripts/getPattern');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit:'50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/main.html');
});

app.post('/', (req, res) => {
  if (req.body == {}){
    res.end('failed');
  }
  frame.data = new Uint8Array(Object.values(JSON.parse(req.body.data)));
  //console.log(frame.data);
  frame.width = parseInt(req.body.width);
  //console.log(typeof frame.width);
  frame.height = parseInt(req.body.height);
  if(frame.width){
    //console.log('Imgage received!');
  }
  let id = imgProcess(frame);
  let resData = JSON.stringify({pat: PAT[id-1], id: id});
  res.end(resData);
});

io.on('connection', (socket) => {
  console.log('connect')
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
