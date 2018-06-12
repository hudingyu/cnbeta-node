/**
 * @fileOverview
 * @name dbhelper.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

const article = require('../model/article');

class dbHelper {
    static async queryArticleList(params) {
        const {
            select,
            size,
            page
        } = params;
        let res = null;
        await article.paginate({}, {
            select: select,
            page: page,
            limit: size,
            sort: {
                sid: -1
            },
        }, (err, result) => {
            if (!err) {
                let resClone = JSON.parse(JSON.stringify(result));
                res = {
                    pagination: {
                        total: resClone.total,
                        current_page: resClone.page,
                        total_page: resClone.pages,
                        page_size: resClone.limit
                    },
                    list: resClone.docs
                };
            } else {
                console.log(err);
            }
        });
        return res;
    }

    static async queryArticle(params) {
        const {
            sid
        } = params;
        let res = null;
        await article.find({sid: sid}, (err, doc) => {
            if (!err) {
                res = doc;
            }
        });
        return res;
    }
}

module.exports = dbHelper;
