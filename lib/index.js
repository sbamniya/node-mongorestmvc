const { help, controller, model } = require("./commands");
/**
 * Handle generate call
 * @author Sonu Bamniya
 * @param args any
 * @returns void
 */
module.exports = args => {
  switch (args[0]) {
    case "--help":
    case "-h":
      return help();
    case "make:controller":
    case "make:c":
    case "make:ctrl":
      return controller(args);
    case "make:model":
    case "make:m":
    case "make:mod":
      return model(args)    
    default:
      throw new Error("Invalid argument passed!");
  }
};
