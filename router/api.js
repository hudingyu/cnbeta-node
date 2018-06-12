/**
 * @fileOverview
 * @name
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

const router = require('koa-router')();
const articleController = require('../controller/article');

router.prefix('/api');

router.get('/timeline', articleController.articlelist);
router.get('/article/:sid', articleController.article);

module.exports = router;
