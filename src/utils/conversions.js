export const toPascal = (str1) => {
    const keys = str1.split('-');

    return keys.map(v => v.charAt(0).toUpperCase() + v.slice(1)).join('');
}