const fs = require('fs');

const dir = './du_script';

fs.rmdirSync(dir, { recursive: true }); 