const express = require("express");
const app = express();

app.get('/', (req, res) => {
  res.send(process.env.GREETING + ' to the express App! ' + process.env.NAME);  
})

app.listen(3003, (err) => {
  if(!err) console.log('App is running');  
})