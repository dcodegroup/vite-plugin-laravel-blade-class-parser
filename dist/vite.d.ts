import type { LaravelBladeClassParserOptions } from "../types";
/**
 * ##########################################
 * #              MAIN FUNCTION             #
 * ##########################################
 */
export default function LaravelBladeClassParser(options: LaravelBladeClassParserOptions): {
    name: string;
    buildStart(): void;
};
