/**
 * @fileOverview
 * @name content.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/5/17
 * @license MIT
 */

/**
 * 遍历数据库中上一阶段得到的新闻列表来获取每篇新闻正文的url，抓取文章正文内容，更新到数据库
 */
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require('async');
const logger = require('../config/log');

const {
    website,
    listBaseUrl,
    contentBaseUrl,
    totalPage
} = require('../config/originconf');

const dbHelper = require('../dbhelper/dbhelper');
const { articleModel, articleDbModel } = require('../model/article');

const {
    sleep,
    styleReg,
    scriptReg,
} = require('../utils/utils');

/**
 * 抓取正文程序入口
 * @returns {Promise.<*>}
 */
const articleContentInit = async() => {
    logger.info('grabbing article contents starts...');
    let uncachedArticleSidList = await getUncachedArticleList(articleDbModel);
    const res = await batchCrawlArticleContent(uncachedArticleSidList);
    if (!res) {
        logger.error('grabbing article contents went wrong...');
    }
    return res;
};

/**
 * 查询新闻列表获取sid列表
 * @param Model
 * @returns {Promise.<void>}
 */
const getUncachedArticleList = async(Model) => {
    const selectedArticleList = await dbHelper.queryDocList(Model).catch(function (err){
        logger.error(err);
    });
    return selectedArticleList.map(item => item.sid);
    // return selectedArticleList.map(item => item._doc.sid);
};

/**
 * 批量抓取新闻详情内容
 * @param list
 * @returns {Promise}
 */
const batchCrawlArticleContent = (list) => {
    return new Promise((resolve, reject) => {
        async.mapLimit(list, 3, (sid, callback) => {
            getArticleContent(sid, callback);
        }, (err, result) => {
            if (err) {
                logger.error(err);
                reject(false);
                return;
            }
            resolve(true);
        });
    });
};

/**
 * 抓取单篇文章内容
 * @param sid
 * @param callback
 * @returns {Promise.<void>}
 */
const getArticleContent = async(sid, callback) => {
    let num = Math.random() * 1000 + 1000;
    await sleep(num);
    let url = contentBaseUrl + sid + '.htm';
    request(url, (err, response, body) => {
        if (err) {
            logger.error('grabbing article content went wrong，article url:' + url);
            callback(null, null);
            return;
        }
        const $ = cheerio.load(body, {
            decodeEntities: false
        });
        let article = {
            sid,
            source: $('.article-byline span a').html() || $('.article-byline span').html(),
            summary: $('.article-summ p').html(),
            content: $('.articleCont').html().replace(styleReg.reg, styleReg.replace).replace(scriptReg.reg, scriptReg.replace),
        };
        saveContentToDB(article);
        callback(null, null);
    });
};

/**
 * 保存到文章内容到数据库
 * @param article
 */
const saveContentToDB = (item) => {
    let flag = dbHelper.updateCollection(articleDbModel, item);
    if (flag) {
        logger.info('grabbing article content succeeded：' + item.sid);
    }
};

module.exports = articleContentInit;