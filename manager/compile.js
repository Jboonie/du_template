const fs = require('fs');


const slots = getProjectConfig();
const handlers = combineConfigs(getConfigs());
const code = getProjectLua();
updateHandlerCode(handlers, code);
const events = [];
const methods = [];

const compileData = {
    slots: slots,
    handlers: handlers,
    events: events,
    methods: methods
};

fs.writeFileSync('./du_script/json/readable/config.json', JSON.stringify(compileData, null, 2));
fs.writeFileSync('./du_script/json/raw/config.json', JSON.stringify(compileData));

function updateHandlerCode(handlers, codes){
    handlers.forEach(item => {
        codes.forEach(code => {
            if(parseInt(code.index) == item.key){
                item.code = code.code;
            }
        })
    })
}

function getProjectConfig(){
    const data = fs.readFileSync('./du_script/lua/project.json');
    return JSON.parse(data).slots;

}
function getConfigs(){
    const dirs = getDirs('./du_script/lua');
    let configs = [];

    dirs.forEach(dir => {
        let files = getConfigFiles(dir);
        files.forEach(file => configs.push(file));
    })
    return configs;
}

function getConfigFiles(dir){
    let files = [];
    const locations = fs.readdirSync(dir, {withFileTypes: true})
        .filter(data => !data.isDirectory())
        .filter(data => data.name.includes('.json'))
        .map(data => dir + '/' + data.name);


    locations.forEach(location => {
        files.push({
            location: location,
        })
    })
    return files;
}

function combineConfigs(configs){
    let config = [];
    configs.forEach(item => {
        config.push(JSON.parse(fs.readFileSync(item.location))[0]);
    })
    return config;
}
function getProjectLua(){
    const dirs = getDirs('./du_script/lua');
    let lua = [];
    dirs.forEach(dir => {
        let files = getLuaFiles(dir);
        files.forEach(file => {
            data = {
                code: String(fs.readFileSync(file.location)),
                index: file.index
            }
            lua.push(data);
        });
    })
    return lua;
}

function getLuaFiles(dir){
    let files = [];
    const locations = fs.readdirSync(dir, {withFileTypes: true})
        .filter(data => !data.isDirectory())
        .filter(data => data.name.includes('.lua'))
        .map(data => dir + '/' + data.name);


    locations.forEach(location => {
        files.push({
            location: location,
            index: fileIndex(location)
        })
    })

    function fileIndex(filename){
        return filename.split('_[')[1].split(']')[0];
    }

    return files;
}

function getDirs(location){
    return fs.readdirSync(location, {withFileTypes: true})
            .filter(data => data.isDirectory())
            .map(data => location + '/' + data.name);
}
