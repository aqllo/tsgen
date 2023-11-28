import YAML from "yaml";

export const loadYaml = (file) => {
    try {
        console.log('📃 Reading configuration...');

        const yaml = YAML.parse(file);

        return [yaml, null];
    } catch (error) {
        return [null, 'There was an error parsing the file, please check the format.'];
    }
}