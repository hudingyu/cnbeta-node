/**
 * mongoDB配置信息
 * @type {{localUrl: string, originIp: string, localPort: number, db: {articlelist: string}, options: {server: {poolSize: number}}}}
 */
module.exports = {
    localUrl: 'localhost',
    originIp: '*',
    localPort: 27017,
    db: {
        articlelist: 'articleList'
    },
    options: {
        server: {
            poolSize: 5
        }
    }
}