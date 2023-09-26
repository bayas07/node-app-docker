const express = require("express");
const chokidar = require("chokidar");
const PropertiesReader = require('properties-reader');
const k8s = require('@kubernetes/client-node');

const app = express();

// Set up the Kubernetes client
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const readPropertyFile = (path) => {
    const properties = PropertiesReader(path);
    return properties.getAllProperties();
};

const readPropertyFromData = (data) => {
  const properties = PropertiesReader().read(data).getAllProperties();
  return properties;
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

// Endpoint to fetch the config map
app.get('/k8s-config', async (req, res) => {
    try {
        const result = await k8sApi.readNamespacedConfigMap('node-config-prop', 'default'); // Replace with your config map name and namespace
        let configData = readPropertyFromData(result.body.data['config.properties']);
        let configNewData = readPropertyFromData(result.body.data['configNew.properties']);
        let config = { data: {...configData, ...configNewData}};
        res.json(config);
    } catch (err) {
        res.status(500).send(`Error fetching config map: ${err.message} ${JSON.stringify(err)}`);
    }
});

app.listen(3003, (err) => {
    if (!err) console.log('App is running');  
});
