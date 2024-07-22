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
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = __importDefault(require("xml2js"));
const get_og_data_js_1 = __importDefault(require("./get-og-data.js"));
let report = [];
const initiation = (url) => __awaiter(void 0, void 0, void 0, function* () {
    let urls = [];
    const setData = () => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield Promise.allSettled((urls === null || urls === void 0 ? void 0 : urls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, get_og_data_js_1.default)(url);
        }))) || []);
        report = results
            .filter((result) => result !== null)
            .map((result) => {
            if (result.status === "fulfilled") {
                return result.value;
            }
            else {
                return {
                    url: result.reason.url,
                    ogData: { title: null, description: null, image: null },
                };
            }
        });
    });
    try {
        const sitemap = yield axios_1.default.get(`${url}/sitemap.xml`);
        const parser = new xml2js_1.default.Parser();
        const sitemapData = yield parser.parseStringPromise(sitemap.data);
        urls = sitemapData.urlset.url.map((url) => url.loc[0]);
        if (urls) {
            urls = urls.slice(0, 5);
        }
    }
    catch (e) {
        console.error("No sitemap found");
    }
    try {
        if (urls && urls.length > 0) {
            yield setData();
        }
    }
    catch (e) {
        console.error("_ERROR_", e.message);
    }
});
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
                yield initiation(url);
                return {
                    statusCode: 200,
                    body: JSON.stringify(report),
                };
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
