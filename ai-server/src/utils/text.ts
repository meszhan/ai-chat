export const toJSON = <T extends {}>(str: string): T => {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.log(e, str);
    }
    return {} as T;
};
