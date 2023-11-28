import { promises as fs } from 'fs';
import process from 'process';
import { toPascal } from './conversions.js';

export const joinProps = (props) => {
    return props.map(p => `'${p}'`).join(' | ');
}

export const buildProps = (props) => {
    const _props = [];

    for (const key in props) {
        if (typeof props[key].type !== 'string' && props[key].type.length) {
            _props.push(`\t${key}: ${joinProps(props[key].type)};`);
        } else {
            _props.push(`\t${key}: ${props[key].type};`);
        }
    }

    return _props;
}

export const generateInterface = async (name, content, path) => {
    const filePath = `${process.cwd()}/src/templates/interfaces.txt`;
    const template = await fs.readFile(filePath, 'utf8');
    const { extends: ext, ...props } = content;

    if (ext) {
        const { interface: itf, pick, omit } = ext;

        if (pick) {
            const itfTmp = template.split('\n').slice(8, 9);
            const def = itfTmp[0].replace('I', toPascal(name)).replace('T', toPascal(itf)).replace('props', joinProps(pick));

            await fs.appendFile(path, ['\n', def, ...buildProps(props), '}'].join('\n'));
            return;
        }

        if (omit) {
            const itfTmp = template.split('\n').slice(12, 13);
            const def = itfTmp[0].replace('I', toPascal(name)).replace('T', toPascal(itf)).replace('props', joinProps(omit));

            await fs.appendFile(path, ['\n', def, ...buildProps(props), '}'].join('\n'));
            return;
        }

        const itfTmp = template.split('\n').slice(4, 5);
        const def = itfTmp[0].replace('I', toPascal(name)).replace('T', toPascal(itf));

        await fs.appendFile(path, ['\n', def, ...buildProps(props), '}'].join('\n'));
        return;
    }

    const itfTmp = template.split('\n').slice(0, 1);
    const def = itfTmp[0].replace('I', toPascal(name));
    const itf = ['\n', def, ...buildProps(props), '}'].join('\n');

    await fs.appendFile(path, itf);
}

export const generateAlias = async (name, content, path) => {
    const filePath = `${process.cwd()}/src/templates/aliases.txt`;
    const template = await fs.readFile(filePath, 'utf8');
    const { interface: ext, type } = content;

    if (ext) {
        const { name: itfName, pick, omit } = ext;

        if (pick) {
            const itfTmp = template.split('\n').slice(2, 3);
            const def = itfTmp[0].replace('T', toPascal(name)).replace('E', toPascal(itfName)).replace('props', joinProps(pick));

            await fs.appendFile(path, ['\n', def].join('\n'));
            return;
        }

        if (omit) {
            const itfTmp = template.split('\n').slice(4, 5);
            const def = itfTmp[0].replace('T', toPascal(name)).replace('E', toPascal(itfName)).replace('props', joinProps(omit));

            await fs.appendFile(path, ['\n', def].join('\n'));
            return;
        }
    }

    const itfTmp = template.split('\n').slice(0, 1);
    const def = itfTmp[0].replace('T', toPascal(name)).replace('props', typeof type !== 'string' && type.length ? joinProps(type) : type);
    const itf = ['\n', def].join('\n');

    await fs.appendFile(path, itf);
}

export const generate = async (schema, outDir, version) => {
    console.log('⏳ Generating types...')
    const workdir = `${process.cwd()}/${outDir ?? 'src'}`;

    try {
        await fs.stat(workdir)
    } catch (_) {
        await fs.mkdir(workdir);
    }

    const path = `${workdir}/types.d.ts`;
    await fs.writeFile(path, `//* Version: ${version}\n//* AQLLO Typescript Generator: Do not modify this file manually.`);
    const { interfaces, aliases } = schema;

    await interfaces.forEach(async (itf) => {
        for (const key in itf) {
            await generateInterface(key, itf[key], path);
        }
    });

    await aliases.forEach(async (als) => {
        for (const key in als) {
            await generateAlias(key, als[key], path);
        }
    });
}