/**
 * ##########################################
 * #                 IMPORTS                #
 * ##########################################
 */
import { parseBlade } from "./parser";
import type { LaravelBladeClassParserOptions } from "../types";
import path from "path";

/**
 * ##########################################
 * #              MAIN FUNCTION             #
 * ##########################################
 */
export default function LaravelBladeClassParser(options: LaravelBladeClassParserOptions) {
  // # Define: Default Configurations
  const configuration: LaravelBladeClassParserOptions = Object.assign(
    {},
    {
      outputFilePath: path.resolve("blade-classes.txt"),
      filterPrefix: "",
      delimiter: ","
    },
    options
  );

  // # Return: Vite Config
  return {
    name: "LaravelBladeClassParser",
    buildStart() {
      // # Parse: Blade Files and write file.
      parseBlade(configuration);
    }
  };
}
