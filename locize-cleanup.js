import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const endpoint = 'https://api.locize.app';
const projectId = '3ccb1326-ce0e-4352-9fcf-676d42f2477d';
const apiKey = 'e39103ba-63a4-4389-a731-c34dd85fc3ee';
const version = 'latest';
const baseLang = 'en';
const localesPath = 'src/i18n/';
const otherLangs = ['ja', 'zh'];
const namespacePrefix = 'd';

function flatten(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const sub = flatten(val);
    if (typeof sub !== 'object') result[key] = sub;
    else {
      for (const subkey of Object.keys(sub)) {
        result[key + '.' + subkey] = sub[subkey];
      }
    }
  }
  return result;
}

const getRemoteLocales = (language, namespace) =>
  fetch(
    `${endpoint}/${projectId}/${version}/${language}/${namespacePrefix}-${namespace}`,
  ).then(x => x.json());

async function run() {
  const baseLangPath = localesPath + baseLang;
  const pp = fs
    .readdirSync(baseLangPath)
    .filter(fn => /^[\w-]+\.yml$/.test(fn) && !/_old\.yml$/.test(fn))
    .map(async ns => {
      const namespace = ns.replace(/.yml$/, '');
      const local = YAML.parse(
        fs.readFileSync(path.join(baseLangPath, ns), 'utf8'),
      );

      for (const lng of [baseLang, ...otherLangs]) {
        const remote = await getRemoteLocales(lng, namespace);

        // calc new changes on local (to save to remote)
        const unused = {};
        const remoteFlat = flatten(remote);
        const localFlat = flatten(local);
        for (const key of Object.keys(remoteFlat)) {
          if (!localFlat[key]) {
            unused[key] = null;
          }
        }

        // send changes in batches of 1000 entries each (locize api limits)
        const changedEntries = Object.entries(unused);
        for (let i = 0; i < changedEntries.length; i += 1000) {
          const batch = changedEntries.slice(i, i + 1000);
          await fetch(
            `${endpoint}/update/${projectId}/${version}/${lng}/${namespacePrefix}-${namespace}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey,
              },
              body: JSON.stringify(Object.fromEntries(batch)),
            },
          );
          console.log(`Post ${batch.length} changes on ${namespace} (${lng})`);
        }
      }
    });
  await Promise.all(pp);
}

run();
