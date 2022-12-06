/**
 * ##########################################
 * #                 IMPORTS                #
 * ##########################################
 */
import glob from "glob";
import fs from "fs";
import { parse } from "node-html-parser";
import type { LaravelBladeClassParserOptions } from "../types";

/**
 *  Function: parseBlade()
 *  Description: Loops through calling script's root dir to search for
 *    `blade.php` files under resources folder and recursively loops through
 *    each file to output unique set of classes based on options.
 *
 *  @param LaravelBladeClassParserOptions options
 */
export const parseBlade = (options: LaravelBladeClassParserOptions) => {
  // # Retrieve: all .blade.php files in the resources folder
  const bladeFiles = glob.sync("resources/**/*.blade.php");

  // # Initialize: empty array to store class names
  let classNames: string[] = [];

  // # Define: Blade Regexp Catch
  /* eslint-disable-next-line max-len,prettier/prettier */
  const bladeRegex = new RegExp(/(@extends\('[^']+'\))|(@if\(.*\))|(@component\(.*\))|(@slot\(.*\))|(@elseif\(.*\))|(@else)|(@endif)|(@foreach\(\$[^\s]+\s+as\s+\$[^\s]+\s+=>\s+\$[^\s]+\))|(@endforeach)|(@for\(.*\))|(@endfor)|(@while\(.*\))|(@endwhile)|(@unless\(.*\))|(@endunless)|(@include\('[^']+'(\s*,\s*\[[^\]]+\])?\))|(@each\('[^']+'\s*,\s*\$[^\s]+\s*,\s*'[^']+'(\s*,\s*'[^']+')?\))|(@lang\('[^']+'\))|(@choice\('[^']+'\s*,\s*\$[^\s]+'\))|(@yield\('[^']+'\))|(@show)|(@section\('[^']+'\))|(@stop)|(@endsection)|(@endslot)|(@append)|(@overwrite)|(@component\('[^']+'\s*,\s*\[[^\]]+\]\))|(@endcomponent)|({{.*?}})/, "g");

  // # Use: PHP parser to extract class names from each file
  bladeFiles.forEach((file) => {
    const fileContents = fs.readFileSync(file, "utf8");

    try {
      // # Parse: the blade file as HTML document
      const root = parse(fileContents.replace(bladeRegex, "").replace(/^\s+|\s+$|\s+(?=\s)/gm, ""));

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
    } catch (e) {
      console.log("Error with parsing file: ", file);
    }
  });

  // # Filter: class names by prefix if specified
  if (typeof options.filterPrefix === "string" && options.filterPrefix) {
    classNames = classNames.filter((className) => className.startsWith(options.filterPrefix ?? ""));
  }

  // # Write: class names to output file
  fs.writeFileSync(options.outputFilePath, classNames.join(options.delimiter), {
    flag: "w",
    encoding: "utf8"
  });
};
