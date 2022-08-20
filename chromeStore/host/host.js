// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// =================================================================
// ======= Native Message Protocol Handling ========================
// =================================================================

const fs = require('fs');
const execFile = require('child_process').execFile;


// get a message and call handleMessage()
process.stdin.on('readable', () => {
  var input = []
  var chunk
  while (chunk = process.stdin.read()) {
    input.push(chunk)
  }
  input = Buffer.concat(input)

  var msgLen = input.readUInt32LE(0)
  var dataLen = msgLen + 4

  if (input.length >= dataLen) {
    var content = input.slice(4, dataLen)
    var json = JSON.parse(content.toString())
    handleMessage(json)
  }
})

// send a message to the extension
function sendMessage(msg) {
  var buffer = Buffer.from(JSON.stringify(msg))
  var header = Buffer.alloc(4)
  header.writeUInt32LE(buffer.length, 0)
  var data = Buffer.concat([header, buffer])
  process.stdout.write(data)
}


// =================================================================
// ======= User Functions ==========================================
// =================================================================

// on error
process.on('uncaughtException', (err) => {
  sendMessage({error: err.toString()})
})


// message handling
function handleMessage(msg) {
  if(msg.cmd === "open-local") {
    openByExplorer(msg.url)
  } else if( msg.cmd === "get-options") {
    sendMessage({options:null, cwd:__dirname}); // return host folder path
  }
}

const fileSuffix = [".xlsx",".docx", ".pptx",".pdf",".txt"]

/* open */
const openByExplorer = (path) => {
  path = decodeURIComponent(path);  
  fs.stat(new URL(path), (err, stats) => {
      if (err) {
          sendMessage({
              path,
              resultMessage: 'file/folder not found.',
              err,
          });
          return;
      }
      if (stats.isDirectory()) {
          execFile('cmd',  ['/c', 'start', '"title"', path]);
          sendMessage({
              path,
              resultMessage: 'opened the folder.',
          });
      } else if(fileSuffix.some(elem => path.toLowerCase().endsWith(elem))) {
        execFile('cmd',  ['/c', 'start', '"title"', path]);
        sendMessage({
            path,
            resultMessage: 'opened the file.',
        });               
      } else {
          execFile('explorer', ['/select,', path]);
          sendMessage({
              path,
              resultMessage: 'opened the folder containing the file.',
          });
      }
  });
};

