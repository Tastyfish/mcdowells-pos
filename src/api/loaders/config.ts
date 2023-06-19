/**
 * Load a config JSON file. The schema is not verified.
 * @param name The config file name.
 */
export async function loadConfig<T>(name: string): Promise<T> {
    return await (await fetch(`./config/${name}.json`)).json() as T
}
