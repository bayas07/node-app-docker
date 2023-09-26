const express = require("express");
const fs = require("fs");
const chokidar = require("chokidar");
const app = express();

let greeting = fs.readFileSync('/config/greeting', 'utf8').trim();
let name = fs.readFileSync('/config/name', 'utf8').trim();
let city = fs.readFileSync('/config/city', 'utf8').trim();

const watcher = chokidar.watch('/config', {
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`);
  if (path.includes('greeting')) {
      greeting = fs.readFileSync('/config/greeting', 'utf8').trim();
      console.log('New greeting:', greeting);
  }
  if (path.includes('name')) {
      name = fs.readFileSync('/config/name', 'utf8').trim();
      console.log('New name:', name);
  }
  if (path.includes('city')) {
    city = fs.readFileSync('/config/city', 'utf8').trim();
    console.log('New name:', name);
}
});

app.get('/', (req, res) => {
    res.send(`App config success - Greeting: ${greeting}, Name: ${name}, City: ${city}`);  
});

app.get('/config', (req, res) => {
  res.send(`Greeting: ${greeting}, Name: ${name}, City: ${city}`);  
});

app.listen(3003, (err) => {
    if (!err) console.log('App is running');  
});

