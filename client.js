const { IP, PORT } = require('./constants');
const net = require('net');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const conn = net.createConnection({
  host: IP, // IP constant
  port: PORT // PORT constant
});

let fileExist = false, copySuccess = false;
const fileReadLine = function() {
  // ask client about the file that they are looking for.
  rl.question('Enter the file name you are looking for(type exit to end): ', (answer) => {
    if (answer === 'exit') {
      conn.end();
      return rl.close();
    }
    conn.write(answer);
    conn.on('data', (data) => {
      if (!fileExist && data === `There is ${answer} in the server!`) { // if there is a file that client wants
        fileExist = true;
        console.log(data);
        rl.question('Do you want to copy this in your device?(Y/N) ', (answer2) => {
          conn.write(answer2);
          // if the client enter n or N, end the program!
          if (answer2 === 'n' || answer2 === 'N') {
            conn.end();
            return rl.close();
          }
        });
      }
      if (fileExist) {
        if (data.slice(0, 12) === 'copying file') {
          // console.log(data.slice(13));
          fs.writeFile(`./client-files/${answer.split('.')[0]}_downloaded.${answer.split('.')[1]}`, data.slice(13), function(err) {
            if (err) {
              return console.log(err);
            }
            copySuccess = true;
            if (copySuccess) {
              console.log(`Saved ${answer} in "./client-files/${answer.split('.')[0]}_downloaded.${answer.split('.')[1]}".`);
              copySuccess = false;
              fileExist = false;
              conn.end();
              return rl.close();
            }
          });
        }
      }
      
    });
    
  });
};

conn.setEncoding('utf8'); // interpret data as text
// when client is connected to the server
conn.on('connect', () => {
  console.log('Connected to the server!');
  fileReadLine();
});
