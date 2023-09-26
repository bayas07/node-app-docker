const express = require("express");
const fs = require("fs");
const chokidar = require("chokidar");
const PropertiesReader = require('properties-reader');
const app = express();

const getConfigProperties = () => {
  const properties = PropertiesReader('/config/config.properties');
  return {
      greeting: properties.get('greeting') || "Default Greeting",
      name: properties.get('name') || "Default Name",
      city: properties.get('city') || "Default city"
      // Add more properties as needed.
  };
};

let { greeting, name, city } = getConfigProperties();

const watcher = chokidar.watch('/config/config.properties', {
    persistent: true
});

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`);
  let updatedConfig = getConfigProperties();
  greeting = updatedConfig.greeting;
  name = updatedConfig.name;
  city = updatedConfig.city;
  // If you add more properties, update them here as well.
  console.log('Updated Config:', updatedConfig);
});

app.get('/', (req, res) => {
    res.send(`App config prop success - Greeting: ${greeting}, Name: ${name}, City: ${city}`);  
});

app.get('/config', (req, res) => {
  res.send(`Greeting: ${greeting}, Name: ${name}, City: ${city}`);  
});

app.listen(3003, (err) => {
    if (!err) console.log('App is running');  
});

