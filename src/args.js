import arg from "arg";
import inquirer from "inquirer";

const defaultArgs = {
  src: "langs",
  target: "langs.csv",
};

export const helpMessage = `This application is converting group of JSON files containing translations in React Intl format
to an CSV file you can use in the spreadsheet app of your choice and vice versa.

Usage: i18n-to-csv -s translations/src -t translations.csv

where arguments are from the list:
--help                 this message

--src, -s <string>     folder of file to be converted, \`langs\` by default
--target, -t <string>  file or folder to save the conversion results, \`langs.csv\` by default

--silent, -sh          do not ask questions and use default values if params are ommited`;

export function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--help": Boolean,
      "--src": String,
      "--target": String,
      "--silent": Boolean,

      // aliases
      "-h": "--help",
      "-s": "--src",
      "-t": "--target",
      "-sh": "--silent",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    displayHelp: args["--help"] || false,
    skipPrompts: args["--silent"] || false,
    src: args["--src"],
    target: args["--target"],
  };
}

export async function promptForMissingOptions(options) {
  const questions = [];

  // questions skipped if --yes argument is present
  if (!options.skipPrompts) {
    if (!options.src) {
      questions.push({
        type: "input",
        name: "src",
        message: "path of the folder with the JSON files or to the CSV-file",
        default: defaultArgs.src,
      });
    }

    if (!options.target) {
      questions.push({
        type: "input",
        name: "target",
        message: "filename or path for the conversion results",
        default: defaultArgs.target,
      });
    }
  }

  const answers = questions.length ? await inquirer.prompt(questions) : {};

  return {
    src: answers.src || options.src || defaultArgs.src,
    target: answers.target || options.target || defaultArgs.target,
  };
}
