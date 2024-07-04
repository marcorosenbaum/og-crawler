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
const { JSDOM } = require("jsdom");
const axios = require("axios");
const extractOGData = (html) => {
    const dom = new JSDOM(html);
    const metaTags = dom.window.document.querySelectorAll("meta");
    const ogData = {};
    metaTags.forEach((tag) => {
        const propertyAttr = tag.getAttribute("property");
        if (propertyAttr && propertyAttr.startsWith("og:")) {
            const property = propertyAttr.slice(3);
            const content = tag.getAttribute("content");
            if (content !== null) {
                ogData[property] = content;
            }
        }
    });
    if (Object.keys(ogData).length === 0) {
        return null;
    }
    return ogData;
};
exports.handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = {};
        if (event.body !== null) {
            const item = JSON.parse(event.body.toString());
            const currentURL = item.url;
            try {
                const response = yield axios.get(currentURL);
                if (response.status > 399) {
                    console.error(`--Error fetching ${currentURL}: ${response.status}`);
                    result = item; //???
                }
                const contentType = response.headers["content-type"];
                if (!contentType || !contentType.includes("text/html")) {
                    console.error(`Non-HTML response for ${currentURL}`);
                    result = item; //???
                }
                const htmlBody = response.data;
                const newOGData = extractOGData(htmlBody);
                result = {
                    url: currentURL,
                    count: item.count,
                    ogData: newOGData,
                };
            }
            catch (error) {
                console.error(`Error fetching ${currentURL}: ${error.message}`);
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ result }),
        };
    });
};
