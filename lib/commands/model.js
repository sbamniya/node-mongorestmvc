const path = require('path')
const { fs, modelPath, allowedFileTypes, capitalize, templatePath } = require('./../helpers')
var ejs = require('ejs');

/**
 * 
 */

const createIndexFile = type => {
    const writeStream = fs.createWriteStream(path.join(modelPath, `index.${type}`))
    const defaultContent = fs.readFileSync(`${templatePath}/${type}/modelIndex`, "utf-8")
    writeStream.write(defaultContent);
    writeStream.end();
    return true;
}

/**
 * 
 */
const createFile = (name, type, args) => {
    if (!name) return console.error('Must supply a name for the model.');
    console.log("name", name);
    name = capitalize(name);
    var attrs = [].slice.call(args, 0);
    
    attrs = parseAttrs(attrs);
    console.info(`Creating new model: ${name}`);
    console.log("attrs", attrs);

    var file = ejs.render(
        fs.readFileSync(`${templatePath}/${type}/model.ejs`, 'utf-8'),
        { name, attrs }
    );
    fs.writeFileSync(path.join(modelPath, `${name}.${type}`), file);
    console.info(name + ' was successfully created!');
}

const parseAttrs = (args) => {
    let Schema = {}
    for (let i = 0; i < args.length; i++) {
        const arg = args[i].split(":");
        Schema[arg[0]] = {}
        for (let j = 1; j < arg.length; j++) {
            const attr = arg[j].split("=");
           
            console.log("attr[1]", attr[1]);
            
            Schema[arg[0]][attr[0]] = attr[0] == "required" ? attr[1] :  attr[0] == "enum" ? attr[1].replace("[","").replace("]","").split(','): capitalize(attr[1])

        }
    } 
    return Schema;

    // let Schema = {}
    // for (let i = 0; i < args.length; i++) {
    //     const arg = args[i].split(":");
    //     Schema[arg[0]] = {}
    //     for (let j = 1; j < arg.length; j++) {
    //         const attr = arg[j].split("=");
    //         Schema[arg[0]][attr[0]] = attr[0] == "enum" ? attr[1].replace("[","").replace("]","").split(',') :attr[1]
    //     }
    // }
    // console.log('====================================');
    // console.log(Schema);
    // console.log('====================================');
    // const writeStream = fs.createWriteStream(path.join(modelPath, `${name}.${type}`))
    // const defaultContent = fs.readFileSync(`${templatePath}/${type}/model`, "utf-8");
    // writeStream.write(defaultContent);
    // writeStream.end();
    // return true;
}

/**
 * 
 */
module.exports = args => {
    const actualArgs = args.splice(1);

    const modelName = actualArgs[0];
    let typeIndex = actualArgs.indexOf("--type")
    let attrIndex = actualArgs.indexOf("--attr")
    // const actualArgsCopy = Object.assign([], actualArgs)
    for (let i = 0; i <= attrIndex; i++) {
        actualArgs.splice(0, 1)
    }
    let type = "js"
    if (typeIndex > -1) {
        if (!actualArgs[typeIndex + 1]) {
            throw new Error("Please provide valid file type.")
        }
        if (allowedFileTypes.indexOf(actualArgs[typeIndex + 1]) === -1) {
            throw new Error(`Please provide valid file type. Allowed type ${allowedFileTypes}`)
        }
    }
    if (!modelName) {
        throw new Error(`Please provid model name`);
    }
    const folderExist = fs.directoryExists(modelPath)
    // directory not exists
    if (!folderExist) {
        // Create model directory
        fs.mkdirSync(modelPath)
    }
    if (!fs.existsSync(`${modelPath}/index.${type}`)) {
        // Create Index file
        createIndexFile(path.join(type))
    }

    // Check if Model name as Model in name
    const actualModelName = modelName.indexOf("Model") > -1 ? `${capitalize(modelName)}` : `${capitalize(modelName)}Model`
    // Create Model file 
    createFile(actualModelName, type, actualArgs)
    console.log(`Model ${actualModelName} created successfully in ${modelPath}`);
}