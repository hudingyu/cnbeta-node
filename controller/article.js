/**
 * @fileOverview
 * @name article.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

const dbHelper = require('../dbhelper/dbhelper');
const {
    handleError,
    handleSuccess
} = require('../utils/handle');

module.exports.articlelist = async(ctx, next) => {
    console.log('start query');
    let reqParam = ctx.request.query;
    let page = reqParam.page || 1;
    let size = reqParam.size || 35;
    const list = await dbHelper.queryArticleList({
        select: '-_id',
        page,
        size,
    });
    if (list) {
        handleSuccess({
            ctx,
            message: '新闻列表请求成功',
            result: list,
        });
    } else {
        handleError({
            ctx,
            message: '新闻列表请求失败',
        });
    }
};

module.exports.article = async(ctx, next) => {
    let reqParam = ctx.params;
    let sid = reqParam.sid;
    const article = await dbHelper.queryArticle({sid: sid});
    if (article) {
        handleSuccess({
            ctx,
            message: '新闻详情请求成功',
            result: article,
        });
    } else {
        handleError({
            ctx,
            message: '新闻详情请求失败',
        });
    }
}