//import { GlideClient, GlideClusterClient, Logger, GlideJson, InfoOptions } from "@valkey/valkey-glide";

const glide = require('@valkey/valkey-glide');

const moduleList = (moduleInfo) => {
    return moduleInfo
        .split('\n')
        .filter(function (line) {
            return line.length > 0 && line.indexOf('#') !== 0 && line.startsWith('module');
        })
        .map(function (line) {
            return line
                .trim()
                .split(':')[1]
                .split(',')
                .reduce((acc, pair) => {
                    const [key, value] = pair.split('=');
                    acc[key] = value;
                    return acc;
                }, {});
        });
}

const main = async () => {
    const addresses = [{ host: "localhost", port: 6379 }];
    const client = await glide.GlideClient.createClient({
        addresses: addresses,
        clientName: "test_standalone_client",
    });

    const pong = await client.customCommand(["PING", "Hello World!"]);
    console.log(pong);

    const set_response = await client.set("foo", "bar");
    console.log(`Set response: ${set_response}`);

    const get_response = await client.get("foo");
    console.log(`Get response: ${get_response}`);

    const info_response = await client.info([glide.InfoOptions.Modules]);
    console.log(`Info response: ${info_response}`);

    const module_info = moduleList(info_response);
    console.log(`Parsed info: ${JSON.stringify(module_info)}`);



    const jsonObj = { a: 1, b: 2, c: "three" };

    const json_set_response = await glide.GlideJson.set(client, "jfoo", "$", JSON.stringify(jsonObj));
    console.log(`JSON Set response: ${json_set_response}`);
}

main();