import {
  parseArgumentsIntoOptions,
  promptForMissingOptions,
  helpMessage,
} from "./args.js";
import fs from "fs";

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

  return Promise.all(promises);
}
