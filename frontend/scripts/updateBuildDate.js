import { writeFile } from 'fs/promises';
import packageJson from './../package.json'with { type: "json" };

packageJson.buildDate = new Date().toISOString();

await writeFile('./package.json', JSON.stringify(packageJson, null, 2));