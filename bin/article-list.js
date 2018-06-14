/**
 * @fileOverview
 * @name article-list.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/5/17
 * @license MIT
 */

/**
 * 根据分页接口获取文章列表，这些列表只包含新闻的基本信息（包括标题、摘要、发布时间等，但没有详情内容）
 * 在下一阶段，将根据新闻列表逐条抓取文章详情内容
 */
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const async = require('async');
const logger = require('../config/log');
const _ = require('lodash');

const {
    website,
    listBaseUrl,
    contentBaseUrl,
    totalPage
} = require('../config/originconf');

const {
    sleep,
    getPageUrlList,
    parseObject,
    mkDirs,
} = require('../utils/utils');

const dbHelper = require('../dbhelper/dbhelper');
const { articleModel, articleDbModel } = require('../model/article');

/**
 * 初始化方法 抓取文章列表
 * @returns {Promise.<*>}
 */
const articleListInit = async() => {
    logger.info('grabbing article list starts...');
    const pageUrlList = getPageUrlList(listBaseUrl, totalPage);
    if (!pageUrlList) {
        return;
    }
    let res = await getArticleList(pageUrlList);
    return res;
}

/**
 * 利用分页接口获取文章列表
 * @param pageUrlList
 * @returns {Promise}
 */
const getArticleList = (pageUrlList) => {
    return new Promise((resolve, reject) => {
        async.mapLimit(pageUrlList, 1, (pageUrl, callback) => {
            getCurPage(pageUrl, callback);
        }, (err, result) => {
            if (err) {
                logger.error('get article list error...');
                logger.error(err);
                reject(false);
                return;
            }
            let articleList = _.flatten(result);
            downloadThumb(articleList);
            saveDB(articleList, resolve);
        })
    })
};

/**
 * 获取当前页面的文章列表
 * @param pageUrl
 * @param callback
 * @returns {Promise.<void>}
 */
const getCurPage = async(pageUrl, callback) => {
    let num = Math.random() * 1000 + 1000;
    await sleep(num);
    request(pageUrl, (err, response, body) => {
        if (err) {
            logger.info('current url went wrong，url address:' + pageUrl);
            callback(null, null);
            return;
        } else {
            let responseObj = JSON.parse(body);
            if (responseObj.result && responseObj.result.list) {
                let newsList = parseObject(articleModel, responseObj.result.list, {
                    pubTime: 'inputtime',
                    author: 'aid',
                    commentCount: 'comments',
                });
                // console.log(newsList);
                callback(null, newsList);
                return;
            }
            console.log("出错了");
            callback(null, null);
        }
    });
};

const downloadThumb = (list) => {
    const host = 'https://static.cnbetacdn.com';
    const basepath = './public/data';
    async.eachSeries(list, (item, callback) => {
        let thumb_url = item.thumb.replace(host, '');
        item.thumb = thumb_url;
        // console.log(thumb_url.substring(0, thumb_url.lastIndexOf('/')));
        mkDirs(basepath + thumb_url.substring(0, thumb_url.lastIndexOf('/')), () => {
            // request(img_src).pipe(fs.createWriteStream('./'+ img_filename));
            console.log(host + thumb_url);
            // console.log(host + thumb_url);
            request(host + thumb_url).pipe(fs.createWriteStream(path.join(basepath, thumb_url)));
            callback(null, null);
        });
    });
}

/**
 * 将文章列表存入数据库
 * @param result
 * @param callback
 * @returns {Promise.<void>}
 */
const saveDB = async(result, callback) => {
    //console.log(result);
    let flag = await dbHelper.insertCollection(articleDbModel, result).catch(function (err){
        logger.error('data insert falied');
    });
    if (!flag) {
        logger.error('news list save failed');
    } else {
        logger.info('list saved！total：' + result.length);
    }
    if (typeof callback === 'function') {
        callback(true);
    }
};

module.exports = articleListInit;