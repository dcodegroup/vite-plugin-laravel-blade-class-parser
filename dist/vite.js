"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ##########################################
 * #                 IMPORTS                #
 * ##########################################
 */
const parser_1 = require("./parser");
const path_1 = __importDefault(require("path"));
/**
 * ##########################################
 * #              MAIN FUNCTION             #
 * ##########################################
 */
function LaravelBladeClassParser(options) {
    // # Define: Default Configurations
    const configuration = Object.assign({}, {
        outputFilePath: path_1.default.resolve("blade-classes.txt"),
        filterPrefix: "",
        delimiter: ","
    }, options);
    // # Return: Vite Config
    return {
        name: "LaravelBladeClassParser",
        buildStart() {
            console.log(configuration);
            // # Parse: Blade Files and write file.
            (0, parser_1.parseBlade)(configuration);
        }
    };
}
exports.default = LaravelBladeClassParser;
//# sourceMappingURL=vite.js.map