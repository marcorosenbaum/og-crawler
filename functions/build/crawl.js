"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_url_1 = __importDefault(require("@esm2cjs/normalize-url"));
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = __importDefault(require("xml2js"));
const report_1 = require("./report");
const getURLsFromHTML_1 = require("./getURLsFromHTML");
// interface Page {
//   string: {
//     count: number;
//     ogData: any;
//   };
// }
const crawlPage = (baseURL, currentURL, pages) => __awaiter(void 0, void 0, void 0, function* () {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL, baseURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }
    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL]) {
        pages[normalizedCurrentURL].count++;
        return pages;
    }
    pages[normalizedCurrentURL] = { count: 1, ogData: null };
    try {
        const response = yield axios_1.default.get(currentURL);
        if (response.status > 399) {
            console.error(`--Error fetching ${currentURL}: ${response.status}`);
            return pages;
        }
        const contentType = response.headers["content-type"];
        if (!contentType || !contentType.includes("text/html")) {
            console.error(`Non-HTML response for ${currentURL}`);
            return pages;
        }
        const htmlBody = response.data;
        const nextURLs = (0, getURLsFromHTML_1.getURLsFromHTML)(htmlBody, baseURL);
        const nextPages = yield Promise.all(nextURLs.map((nextURL) => __awaiter(void 0, void 0, void 0, function* () {
            pages = yield crawlPage(baseURL, nextURL, pages);
        })));
        nextPages.forEach((page) => {
            Object.assign(pages, page);
        });
    }
    catch (error) {
        console.error(`Error fetching ${currentURL}: ${error.message}`);
    }
    return pages;
});
const normalizeURL = (url) => {
    return (0, normalize_url_1.default)(url, { stripWWW: false });
};
exports.handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.body !== null) {
            const { url } = JSON.parse(event.body.toString());
            if (!url) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "URL is required" }),
                };
            }
            try {
                const normalizedURL = normalizeURL(url);
                const sitemap = yield axios_1.default.get(`${normalizedURL}/sitemap.xml`);
                if (!sitemap) {
                    console.log("No sitemap found");
                    const pages = yield crawlPage(url, url, {});
                    const report = (0, report_1.generateReport)(pages);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ url, report }),
                    };
                }
                else if (sitemap) {
                    console.log("Sitemap found");
                    const parser = new xml2js_1.default.Parser();
                    const sitemapData = yield parser.parseStringPromise(sitemap.data);
                    const urls = sitemapData.urlset.url.map((url) => url.loc[0]);
                    const report = urls.map((url) => ({
                        url,
                        count: 1,
                        ogData: null,
                    }));
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ url, report }),
                    };
                }
            }
            catch (error) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: error.message }),
                };
            }
        }
    });
};
