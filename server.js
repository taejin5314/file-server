const { IP, PORT } = require('./constants');
const net = require('net');
const server = net.createServer();
const fs = require('fs');
const stats = fs.statSync;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8');
  client.on('data', (data) => {
    console.log('From client:', data);
    if (stats(`./server-files/${data}`).isFile()) {
      client.write(`There is ${data}!`);
    }
  });
});