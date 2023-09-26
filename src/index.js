const express = require("express");
const chokidar = require("chokidar");
const PropertiesReader = require('properties-reader');
const app = express();

const readPropertyFile = (path) => {
    const properties = PropertiesReader(path);
    return properties.getAllProperties();
};

let config = { ...readPropertyFile('/config/config.properties'), ...readPropertyFile('/config/configNew.properties') };

const watcher = chokidar.watch('/config', {
    persistent: true
});

watcher.on('change', (path) => {
    console.log(`File ${path} has been changed`);

    // Update the relevant properties based on the changed file
    if (path.endsWith('config.properties')) {
        config = { ...config, ...readPropertyFile(path) };
    } else if (path.endsWith('configNew.properties')) {
        config = { ...config, ...readPropertyFile(path) };
    }

    console.log('Updated Config:', config);
});

app.get('/', (req, res) => {
    res.send(`App config prop success - Greeting: ${config.greeting || "Default Greeting"}, Name: ${config.name || "Default Name"}, City: ${config.city || "Default city"}, isXCC: ${config.isXCC || 'false'}`);  
});

app.get('/config', (req, res) => {
    res.send(`Greeting: ${config.greeting || "Default Greeting"}, Name: ${config.name || "Default Name"}, City: ${config.city || "Default city"}, isXCC: ${config.isXCC || 'false'}`);
});

app.listen(3003, (err) => {
    if (!err) console.log('App is running');  
});
