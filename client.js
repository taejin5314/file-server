const { IP, PORT } = require('./constants');
const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const conn = net.createConnection({
  host: IP, // IP constant
  port: PORT // PORT constant
});

const recursiveReadLine = function() {
  // ask client about the file that they are looking for.
  rl.question('Enter the file name you are looking for(type exit to end): ', (answer) => {
    if (answer === 'exit') return rl.close();
    else {
      conn.write(answer);
      conn.on('data', (data) => console.log(data));
      recursiveReadLine();
    }
  });
};

conn.setEncoding('utf8'); // interpret data as text
conn.on('connect', () => {
  console.log('Connected to the server!');
  recursiveReadLine();
});
