# i18n-to-scv

Small CLI script that converts the source files for all languages in the React Intl translations format to one CSV containing all the languages, and also can convert everythng back to separate language JSON files.

## Installation

There is no need for an istallation. Just run the script from this folder:

```
$ node bin/i18n-to-csv <args>
```

If you want to make it available globally in the system you can make a link and then use it by it's name:

```
$ npm link
$ i18n-to-csv <args>
```

## Arguments

--help Help text describing the folllowing arguments

### Converting JSON-files to CSV

If --src param is a folderm then the conversion is JSON->CSV

--src Path to folder, where the JSON-files are located. When available the JSON is converted to CSV. `langs` by default
--target name of the CSV-file with the results. `langs.csv` by default

### Converting CSV to JSON-files

If --src param is ponting at file, then the conversion is CSV->JSON

--src name of the CSV-file to be converted to JSON.
--target Path to folder where all the JSON-files will be saved. `langs` by default
