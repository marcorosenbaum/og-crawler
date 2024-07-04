"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getURLsFromHTML = void 0;
const jsdom_1 = require("jsdom");
const getURLsFromHTML = (htmlBody, baseURL) => {
    const urls = [];
    const dom = new jsdom_1.JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll("a");
    for (const linkElement of linkElements) {
        let href = linkElement.href;
        if (href.startsWith("/")) {
            href = new URL(href, baseURL).href;
        }
        try {
            const urlObj = new URL(href);
            urls.push(urlObj.href);
        }
        catch (error) {
            console.error(`Invalid URL ${href}: ${error.message}`);
        }
    }
    return urls;
};
exports.getURLsFromHTML = getURLsFromHTML;
