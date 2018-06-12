/**
 * @fileOverview
 * @name
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const logger = require('koa-logger');

module.exports = (app) => {
    app.use(bodyParser({
        enableTypes: ['json', 'form', 'text']
    }));
    app.use(logger());
    app.use(async(ctx, next) => {
        const start = new Date();
        await next();
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
    onerror(app);
};
