const { IP, PORT } = require('./constants');
const net = require('net');
const server = net.createServer();
const fs = require('fs');
const stats = fs.statSync;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

// when the client is connected to the server
let filePath, fileExist = false;
server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8');
  client.on('data', (data) => {
    console.log('From client:', data);
    if (!fileExist) {
      if (stats(`./server-files/${data}`).isFile()) {
        filePath = `./server-files/${data}`;
        fileExist = true;
        client.write(`There is ${data} in the server!`);
      }
    } else if (fileExist && (data === 'Y' || data === 'y')) {
      fs.readFile(filePath, 'utf8', function(err, contents) {
        if (err) {
          console.log(err);
        } else {
          client.write('copying file\n' + contents);
          fileExist = false;
        }
      });
    } else {
      client.write("Copy cancelled!");
      client.end();
      fileExist = false;
    }
  });
});