import { execSync } from 'child_process';

/** @type {import('next-sitemap').IConfig} */
export default {
    siteUrl: 'https://www.thecustardscreams.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    transform: (config, path) => {
        let lastmod = new Date().toISOString();
        try {
            lastmod = execSync(`git log -1 --format=%cI .${path}`).toString().trim();
        } catch (e) {
            // ignore error
        }
        return {
            loc: path, // => this will be exported as http(s)://<siteUrl>/<path>
            changefreq: 'daily',
            priority: 0.7,
            lastmod: lastmod,
            alternateRefs: config.alternateRefs,
        }
    },
};
