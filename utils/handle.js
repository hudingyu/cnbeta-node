/**
 * @fileOverview
 * @name utils.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

exports.handleError = ({ ctx, message = '请求失败', err = null }) => {
    ctx.response.body = { code: 500, message, debug: err }
};

exports.handleSuccess = ({ ctx, message = '请求成功', result = null }) => {
    ctx.response.body = { code: 200, message, result }
};