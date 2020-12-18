const path = require("path");
const {
  fs,
  routePath,
  allowedFileTypes,
  capitalize,
  templatePath,
} = require("./../helpers");
var ejs = require("ejs");
/**
 *
 */
const createIndexFile = (type) => {
  const writeStream = fs.createWriteStream(
    path.join(routePath, `index.${type}`)
  );
  const defaultContent = fs.readFileSync(
    `${templatePath}/${type}/routeIndex`,
    "utf8"
  );
  writeStream.write(defaultContent);
  writeStream.end();
  return true;
};

/**
 *
 */
const createFile = (name, type) => {
  console.log("name", name);
  var file = ejs.render(
    fs.readFileSync(`${templatePath}/${type}/route.ejs`, "utf-8"),
    { name }
  );
  fs.writeFileSync(path.join(routePath, `${name}.${type}`), file);
};

/**
 *
 */
module.exports = (args) => {
  const actualArgs = args.splice(1);
  const routeName = actualArgs[0];
  let typeIndex = actualArgs.indexOf("--type");
  let type = "js";
  if (typeIndex > -1) {
    if (!actualArgs[typeIndex + 1]) {
      throw new Error("Please provide valid file type");
    }
    if (allowedFileTypes.indexOf(actualArgs[typeIndex + 1]) === -1) {
      throw new Error(
        `Please provide valid file type. Allowed types: ${allowedFileTypes}`
      );
    }
    type = actualArgs[typeIndex + 1];
  }
  if (!routeName) {
    throw new Error(`Please provide route name`);
  }
  let folderExists = fs.directoryExists(routePath);
  // directory not exists
  if (!folderExists) {
    // create route directory
    fs.mkdirSync(routePath);
  }

  if (!fs.existsSync(`${routePath}/index.${type}`)) {
    // Create index file
    createIndexFile(type);
  }
  // Check if route name as route in name
  const actualRouteName =
    routeName.indexOf("Route") > -1
      ? `${capitalize(routeName)}`
      : `${capitalize(routeName)}Route`;
  // Create Route File
  createFile(actualRouteName, type);

  console.log(`Route ${actualRouteName} created successfully in ${routePath}`);
};
