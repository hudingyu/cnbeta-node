/**
 * @fileOverview
 * @name router/index.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

const api = require('./api');

module.exports = (app) => {
    app.use(api.routes(), api.allowedMethods());
};
