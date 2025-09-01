"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: "dlexingxt",
    api_key: "363794314916387",
    api_secret: "1wxujcBdFyABnwJ8nyKSwqnCWkc",
});
exports.default = cloudinary_1.v2;
