import {
  parseArgumentsIntoOptions,
  promptForMissingOptions,
  helpMessage,
} from "./args.js";
import fs from "fs";
import path from "path";

export async function cli(args) {
  const promises = [];

  // get argument values
  const options = parseArgumentsIntoOptions(args);

  if (options.displayHelp) {
    // if the user is asking for help - display the help message and quit
    console.log(helpMessage);
    return;
  }

  // ask for the missing answers (if needed)
  const answers = await promptForMissingOptions(options);

  // checks

  // check is there file or folder with the given name
  if (!fs.existsSync(answers.src)) {
    console.error(
      "\x1b[31m",
      "\nThere is no file or folder with name",
      `\x1b[1m${answers.src}\x1b[0m\x1b[31m`,
      "found. Please specify existing file or folder.",
      "\x1b[0m"
    );

    return;
  }

  // check is this file or folder
  // to know what to do with it
  if (fs.lstatSync(answers.src).isDirectory()) {
    // convert JSON to CSV

    // get all json files from the folder
    const jsonFiles = fs
      .readdirSync(answers.src)
      .filter((file) => path.extname(file) === ".json");

    if (jsonFiles.length === 0) {
      console.error(
        "\x1b[31m",
        "\nNo JSON files in the selected folder",
        "\x1b[0m"
      );

      return;
    }

    // convert the files into array
    const result = await convertJSON2CSV(answers.src, jsonFiles);

    // save the array into file
    writeCSVtoFile(result, answers.target);
  } else if (fs.lstatSync(answers.src).isFile()) {
    // convert CSV to JSON

    console.log("It's a file!");
  } else {
    console.error(
      `\x1b[1m${answers.src}\x1b[0m\x1b[31m`,
      "is not a file or folder. Please specify different path",
      "\x1b[0m"
    );

    return;
  }

  return Promise.all(promises);
}

/**
 * Reads all the JSON files and creates two dimensional array
 *
 * @param {string} path          folder where the files are located
 * @param {Array<string>} files  file names in the folder
 */
async function convertJSON2CSV(folder, files) {
  const keys = {};

  files.forEach((file) => {
    // read each file
    const data = fs.readFileSync(path.join(folder, file));
    const lang = path.basename(file, ".json");
    // convert into JS object
    const json = JSON.parse(data);
    // put the data into the result object
    Object.keys(json).forEach((key) => {
      if (!keys[key]) {
        // we don't have this key yet
        keys[key] = {
          key,
          description: json[key].description || "",
          [lang]: json[key].defaultMessage || "",
        };
      } else {
        // we already have the key from another language
        keys[key][lang] = json[key].defaultMessage || "";
      }
    });
  });

  const langs = files.map((file) => path.basename(file, ".json"));

  // header
  const result = [["key", "description", ...langs]];
  // data
  Object.keys(keys).forEach((key) => {
    const item = keys[key];
    result.push([
      item.key,
      item.description,
      ...langs.map((lang) => item[lang]),
    ]);
  });

  return result;
}

async function writeCSVtoFile(data, file) {
  const writeStream = fs.createWriteStream(file);
  data.forEach((row) => {
    writeStream.write(
      '"' + row.map((value) => value.replace(/"/g, '""')).join('","') + '"\n'
    );
  });
}
