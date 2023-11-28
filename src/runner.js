import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import Command from "./commands/generate/cli.js";

export const runCommand = () => {
    yargs(hideBin(process.argv)).command(Command).parse();
}