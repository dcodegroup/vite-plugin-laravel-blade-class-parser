"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlade = void 0;
/**
 * ##########################################
 * #                 IMPORTS                #
 * ##########################################
 */
const glob_1 = __importDefault(require("glob"));
const fs_1 = __importDefault(require("fs"));
const node_html_parser_1 = require("node-html-parser");
const tailwindclasses_1 = __importDefault(require("./lib/tailwindclasses"));
/**
 *  Function: parseBlade()
 *  Description: Loops through calling script's root dir to search for
 *    `blade.php` files under resources folder and recursively loops through
 *    each file to output unique set of classes based on options.
 *
 *  @param LaravelBladeClassParserOptions options
 */
const parseBlade = (options) => {
    // # Retrieve: all .blade.php files in the resources folder
    const bladeFiles = glob_1.default.sync("resources/**/*.blade.php");
    // # Initialize: empty array to store class names
    let classNames = [];
    // # Define: Blade Regexp Catch
    /* eslint-disable-next-line max-len,prettier/prettier */
    const bladeRegex = new RegExp(/(@extends\('[^']+'\))|(@if\(.*\))|(@component\(.*\))|(@slot\(.*\))|(@elseif\(.*\))|(@else)|(@endif)|(@foreach\(\$[^\s]+\s+as\s+\$[^\s]+\s+=>\s+\$[^\s]+\))|(@endforeach)|(@for\(.*\))|(@endfor)|(@while\(.*\))|(@endwhile)|(@unless\(.*\))|(@endunless)|(@include\('[^']+'(\s*,\s*\[[^\]]+\])?\))|(@each\('[^']+'\s*,\s*\$[^\s]+\s*,\s*'[^']+'(\s*,\s*'[^']+')?\))|(@lang\('[^']+'\))|(@choice\('[^']+'\s*,\s*\$[^\s]+'\))|(@yield\('[^']+'\))|(@show)|(@section\('[^']+'\))|(@stop)|(@endsection)|(@endslot)|(@append)|(@overwrite)|(@component\('[^']+'\s*,\s*\[[^\]]+\]\))|(@endcomponent)|({{.*?}})/, "g");
    // # Use: PHP parser to extract class names from each file
    bladeFiles.forEach((file) => {
        let fileContents = fs_1.default.readFileSync(file, "utf8");
        if (!options.tailwindMode) {
            fileContents = fileContents.replace(bladeRegex, "").replace(/^\s+|\s+$|\s+(?=\s)/gm, "");
        }
        try {
            if (!options.tailwindMode) {
                // # Parse: the blade file as HTML document
                const root = (0, node_html_parser_1.parse)(fileContents);
                // # Get: all elements that match the selector "*"
                const elements = root.querySelectorAll("*");
                // # Loop: through the elements and add their unique class names to the array
                elements.forEach((element) => {
                    element.classList.value.forEach((className) => {
                        if (!classNames.includes(className)) {
                            classNames.push(className);
                        }
                    });
                });
            }
            else {
                // console.log("🟢🟢🟢");
                // console.log(tailwindClasses);
                tailwindclasses_1.default.forEach((className, classIndex) => {
                    if (typeof className === "string") {
                        // console.log("👀 Searching class name: " + className);
                        if (fileContents.includes(className)) {
                            // console.log("🔍 [" + file + "] matching class: " + className);
                            tailwindclasses_1.default.splice(classIndex, 1);
                            if (classNames.indexOf(className) === -1) {
                                classNames.push(className);
                            }
                        }
                    }
                    else if (className instanceof RegExp) {
                        const matches = fileContents.match(className);
                        if (matches !== null) {
                            const uniqueMatches = matches.filter((value, index, self) => self.indexOf(value) === index);
                            // console.log("🔍 [" + file + "] matching class: ", uniqueMatches);
                            classNames = classNames.concat(uniqueMatches);
                        }
                    }
                });
            }
        }
        catch (e) {
            console.log("Error with parsing file: ", file);
        }
    });
    // # Filter: class names by prefix if specified
    if (typeof options.filterPrefix === "string" && options.filterPrefix) {
        classNames = classNames.filter((className) => { var _a; return className.startsWith((_a = options.filterPrefix) !== null && _a !== void 0 ? _a : ""); });
    }
    // # Filter: Unique again for tailwind mode
    if (options.tailwindMode) {
        classNames = classNames.filter((value, index, self) => self.indexOf(value) === index);
    }
    // # Write: class names to output file
    fs_1.default.writeFileSync(options.outputFilePath, classNames.join(options.delimiter), {
        flag: "w",
        encoding: "utf8"
    });
};
exports.parseBlade = parseBlade;
//# sourceMappingURL=parser.js.map