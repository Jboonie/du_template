const fs = require('fs');

let directories = [
    './du_script',
    './du_script/json',
    './du_script/json/raw',
    './du_script/json/readable',
    './du_script/lua'
]

let files = [
    './du_script/json/raw/config.json',
    './du_script/json/readable/config.json'
]

directories.forEach(dir => {
    createDirectory(dir);
})

files.forEach(file => {
    fs.writeFileSync(file, '{}');
})

function createDirectory(dir){
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}