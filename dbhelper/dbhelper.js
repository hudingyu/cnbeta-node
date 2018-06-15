/**
 * @fileOverview
 * @name dbhelper.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/6/8
 * @license MIT
 */

const {articleModel, articleDbModel} = require('../model/article');
const logger = require('../config/log');

class dbHelper {
    static async emptyCollection(Model) {
        let flag = true;
        let res = await Model.collection.remove();
        if (!res) {
            flag = false;
        }
        return flag;
    }

    static async insertCollection(Model, insertList) {
        let flag = true;
        let res = await Model.collection.insert(insertList);
        if (!res) {
            flag = false;
        }
        return flag;
    }

    static async updateCollection(Modle, doc) {
        let flag = true;
        let updateRes = await Modle.update({sid: doc.sid}, doc);
        if (!updateRes) {
            logger.error('保存文章内容出错，文章sid：' + doc.sid);
            flag = false;
        }
        return flag;
    }

    static async queryDocList(Model) {
        const list  = await Model.find({content: {$exists: false}}).catch((err) => {
            logger.error('查询文章列表出错');
            logger.error(err);
        });
        return list;
    }
    static async queryArticleList(params) {
        const {
            select,
            size,
            page
        } = params;
        let res = null;
        await articleDbModel.paginate({}, {
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
        let res = await articleDbModel.find({sid: sid}, (err, doc) => {
            if (err) {
                console.log(err);
            }
        });
        if (!res[0].sid) res = null;
        return res;
    }
}

module.exports = dbHelper;
