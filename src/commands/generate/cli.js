import { promises as fs } from 'fs';
import axios from 'axios';

import { loadYaml } from "../../utils/yaml-load.js";
import { generate } from '../../utils/generate.js';

const Command = {
    command: 'generate',
    describe: 'Generates TypeScript interfaces or type aliases from a .yaml specification.',
    builder: {
        file: {
            describe: '.yaml specification file'
        }
    },
    handler: async function (args) {
        const { f, o, c } = args;

        if (!f) {
            console.error('Please add -f file spec.')
            return;
        }

        try {
            let file;

            if (!f.includes('https://')) {
                file = await fs.readFile(f, 'utf8');

                const [yaml, errorYaml] = loadYaml(file)

                if (errorYaml) {
                    console.error(errorYaml);
                    return;
                }

                const { version, ...schemas } = yaml;

                await generate(schemas, o, version);
            }
            else {
                const res = await axios.get(f, {
                    ...(c && {
                        headers: {
                            Authorization: `Bearer ${Buffer.from(c).toString()}`
                        }
                    })
                });
                file = res.data

                const [yaml, errorYaml] = loadYaml(file)

                if (errorYaml) {
                    console.error(errorYaml);
                    return;
                }

                const { version, ...schemas } = yaml;

                await generate(schemas, o, version);
            }
        } catch (error) {
            console.error("Something went wrong while reading the file, please check the file location.");
        }
    }
}

export default Command;
