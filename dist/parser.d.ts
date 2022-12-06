import type { LaravelBladeClassParserOptions } from "../types";
/**
 *  Function: parseBlade()
 *  Description: Loops through calling script's root dir to search for
 *    `blade.php` files under resources folder and recursively loops through
 *    each file to output unique set of classes based on options.
 *
 *  @param LaravelBladeClassParserOptions options
 */
export declare const parseBlade: (options: LaravelBladeClassParserOptions) => void;
