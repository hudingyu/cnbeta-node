/**
 * @fileOverview
 * @name index.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/5/17
 * @license MIT
 */

const articleListInit = require('./article-list');
const articleContentInit = require('./content');
const logger = require('../config/log');

const start = async() => {
    let articleListRes = await articleListInit();
    if (!articleListRes) {
        logger.warn('news list update failed...');
    } else {
        logger.info('news list update succeed！');
    }

    let articleContentRes = await articleContentInit();
    if (!articleContentRes) {
        logger.warn('article content grab error...');
    } else {
        logger.info('article content grab succeed！');
    }
};

if (typeof articleListInit === 'function') {
    start();
}
setInterval(start, 600000);

require('./server');
