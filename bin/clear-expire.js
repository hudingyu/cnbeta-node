/**
 * @fileOverview
 * @name clear-expire.js
 * @author hudingyu <hudingyu@meituan.com>
 * @date 2018/7/6
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

// const basePath = '/Users/dianping/Developer/cnbeta-node/public/data/';
const basePath = '/root/home/cnbeta-node/public/data/';
const hourLength = 24;
let expireCriticalTime = new Date(Date.now() - hourLength * 60 * 60 * 1000);

function handleFile(pathName) {
    const stat = fs.statSync(pathName);
    if (stat.birthtimeMs < expireCriticalTime) {
        fs.unlink(pathName, (err) => {
            if (err) throw err;
            console.log(pathName);
        });
    }
}

function handleDir(pathName) {
    fs.readdir(pathName, (err, files) => {
        if (!err) {
            if (!files.length) {
                fs.rmdirSync(pathName);
                return;
            }
            files.forEach(file => {
                const stat = fs.statSync(path.join(pathName, file));
                if (stat && stat.isDirectory()) {
                    handleDir(path.join(pathName, file));
                } else {
                    handleFile(path.join(pathName, file));
                }
            });
        }
    });
}

console.log('clear start ......');
handleDir(basePath);
setInterval(function(pathName) {
    expireCriticalTime = new Date(Date.now() - hourLength * 60 * 60 * 1000);
    handleDir(pathName);
}, hourLength * 60 * 60 * 1000, basePath);