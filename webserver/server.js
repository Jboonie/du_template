const express = require('express')
const configManager = require('./configManager');
const app = express()
const port = 9999

configManager.convertJsonToReadable();

app.use('./webserver/public', express.static('public'));

app.listen(port, () => {
  console.log(`View available at http://localhost:${port}`);
})