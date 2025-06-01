import {
  createWriteStream,
  unlinkSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { resolve } from 'path';
import { SitemapAndIndexStream, SitemapStream } from 'sitemap';

const domain = 'https://app.wisdomise.com';
const apiBaseUrl = 'https://temple.wisdomise.com';
const publicDir = './public';

const sms = new SitemapAndIndexStream({
  limit: 2000,
  getSitemapStream: i => {
    const sitemapStream = new SitemapStream({
      hostname: domain,
    });
    const name = `${i}.xml`;

    const ws = createWriteStream(resolve(publicDir, './sitemaps', name));
    sitemapStream.pipe(ws);

    return [new URL(`sitemaps/${name}`, domain).toString(), sitemapStream, ws];
  },
});

const start = async () => {
  console.time('Time');
  console.log(`[1/6] Clean old sitemaps...`);
  readdirSync(resolve(publicDir, './sitemaps')).forEach(row => {
    unlinkSync(resolve(publicDir, './sitemaps', row));
  });

  console.log('[2/6] Create sitemaps write stream...');

  sms.pipe(createWriteStream(resolve(publicDir, './sitemap.xml')));

  console.log('[3/6] Write dashboard static urls...');
  [
    { url: '/', changefreq: 'weekly' },
    { url: '/discovery?list=coin-radar', changefreq: 'always' },
    { url: '/discovery?list=social-radar', changefreq: 'always' },
    { url: '/discovery?list=technical-radar', changefreq: 'always' },
    { url: '/discovery?list=whale-radar', changefreq: 'always' },
    { url: '/discovery?list=network-radar', changefreq: 'always' },
  ].forEach(item => sms.write(item));

  console.log('[4/6] Fetch all supported tokens...');
  const { slugs } = await fetch(
    `${apiBaseUrl}/api/v1/delphi/market/token-review/supported-tokens`,
    {
      method: 'GET',
    },
  ).then(resp => resp.json());

  console.log('[5/6] Write tokens urls...');
  slugs.forEach(slug =>
    sms.write({
      url: `/discovery?detail=coin&slug=${slug}`,
      changefreq: 'always',
    }),
  );

  console.log('[6/6] Close sitemap write stream...');
  sms.end();

  console.log('Done!');
  console.timeEnd('Time');
};

start();
