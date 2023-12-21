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
    .filter(fn => /^[\w-]+\.yml$/.test(fn))
    .map(ns => {
      const namespace = ns.replace(/.yml$/, '');
      return getRemoteLocales(baseLang, namespace).then(async remote => {
        const local = YAML.parse(
          fs.readFileSync(path.join(baseLangPath, ns), 'utf8'),
        );

        // calc new changes on local (to save to remote)
        const patches = {};
        const remoteFlat = flatten(remote);
        const localFlat = flatten(local);
        for (const key of Object.keys(localFlat)) {
          if (localFlat[key] !== remoteFlat[key]) {
            patches[key] = localFlat[key];
          }
        }

        // send changes in batches of 1000 entries each (locize api limits)
        const changedEntries = Object.entries(patches);
        for (let i = 0; i < changedEntries.length; i += 1000) {
          const batch = changedEntries.slice(i, i + 1000);
          await fetch(
            `${endpoint}/update/${projectId}/${version}/${baseLang}/${namespacePrefix}-${namespace}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey,
              },
              body: JSON.stringify(Object.fromEntries(batch)),
            },
          );
          console.log('Post ' + batch.length + ' changes on ' + namespace);
        }

        // send used keys in batches of 1000 entries each (locize api limits)
        const usedEntries = Object.keys(localFlat);
        for (let i = 0; i < usedEntries.length; i += 1000) {
          const batch = usedEntries.slice(i, i + 1000);
          await fetch(
            `${endpoint}/used/${projectId}/${version}/${baseLang}/${namespacePrefix}-${namespace}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey,
              },
              body: JSON.stringify(batch),
            },
          );
          console.log('Post ' + batch.length + ' used keys on ' + namespace);
        }

        // fetch and save other langs from locize and save to local
        for (let lng of otherLangs) {
          const trans = await getRemoteLocales(lng, namespace);
          if (Object.keys(trans).length) {
            const localPath = path.join(localesPath, lng, ns);
            fs.writeFileSync(localPath, YAML.stringify(trans));
            console.log('Write ' + localPath);
          }
        }
      });
    });
  await Promise.all(pp);
}

run();
