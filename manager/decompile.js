const fs = require('fs');

const raw_config_location = './du_script/json/raw/config.json';
const readable_config_location = './du_script/json/readable/config.json';

const file = fs.readFileSync(raw_config_location);
const data = JSON.parse(file);

fs.writeFileSync(readable_config_location, JSON.stringify(data, null, 2));

let slots = [];
Object.keys(data.slots).forEach(item => {
    slots.push({index: item, name:data.slots[item].name});
})

let handlers = [];

Object.keys(data.handlers).forEach(item => {
    handlers.push(data.handlers[item]);
})

handlers.forEach(item => {
    const slot_index = item.filter.slotKey;
    const parent_directory = slots.filter(slot => slot.index == slot_index)[0].name;
    const directory = createDirectory(parent_directory);
    const fileName = createFileName(item, directory);
    fs.writeFileSync(fileName, item.code);
})

const project_directories = buildDirectories(data);

function buildDirectories(data){
    const base = './du_script/lua';
    const directoryIndexes = data.handlers.map(item => item.filter.slotKey);
    const activeDirectories = slots.filter(item => directoryIndexes.includes(item.index));
    activeDirectories.forEach(item => {
        const itemHandlers = data.handlers.filter(handle => handle.filter.slotKey == item.index);
        fs.writeFileSync(base + '/' + item.name + '/config.json', JSON.stringify(itemHandlers));
    })
}


packProjectConfig('./du_script/lua/project.json', data);

function packProjectConfig(location, data){
    const projectConfigFile = { slots: data.slots}
    fs.writeFileSync(location, JSON.stringify(projectConfigFile));
}
function createDirectory(dir){
    const base_dir = './du_script/lua';
    const full_dir = base_dir + '/' + dir;

    if(!fs.existsSync(full_dir)){
        fs.mkdirSync(full_dir);
    }

    return full_dir;
}

function createFileName(item, directory){
    const file_name_first = item.filter.signature.split('(')[0];
    const args = item.filter.args;
    const ext = '.lua';
    const index = item.key
        
    let file_name_second = '';
    args.forEach(arg => {
        if('value' in arg){
                file_name_second += '_' + arg.value;
        }
        if('variable' in arg){
            const data = '_' + arg.variable;
            file_name_second += data.replace('*','astrisk');
        }
    });

    return directory + '/' + file_name_first + file_name_second + '_[' + index + ']' + ext;
}