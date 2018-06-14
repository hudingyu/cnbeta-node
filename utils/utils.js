
const logger = require('../config/log');
const fs = require('fs');

/**
 *
 * @param listBaseUrl
 * @param totalPage
 * @returns {Array}
 */
const getPageUrlList = (listBaseUrl, totalPage) => {
    let pageUrlList = [];
    for (let i = 1; i <= totalPage; i++) {
        pageUrlList.push(listBaseUrl + i);
    }
    return pageUrlList;
};

/**
 * sleep函数
 * @param {*} times
 */
const sleep = async(times) => {
    logger.info('crawler rests' + times + 'ms');
    await new Promise((resolve) => {
        setTimeout(resolve, times);
    });
    return true;
}

/**
 * 根据预设的数据结构解析当前数据，replacedKeyPairs存放对应的替换键对
 * @param model
 * @param pObject
 * @param replacedKeyPairs
 * @returns {{}}
 */
const parseObject = (model, list, replacedKeyPairs) => {
    return list.map(item => {
        let parsedObject = {};
        Object.keys(model).forEach((key) => {
            if (key in replacedKeyPairs) {
                eval('parsedObject[key] = item.' + replacedKeyPairs[key]);
            } else if (item.hasOwnProperty(key)) {
                parsedObject[key] = item[key];
            }
        });
        return parsedObject;
    })
};

const styleReg = {
    reg: / style="[^"]*"/g,
    replace: '',
};

const scriptReg = {
    reg: /<script(.*?)<\/script>/g,
    replace: '',
};

//创建文件夹
function  mkdir(pos, dirArray, _callback){
    var len = dirArray.length;
    if( pos >= len || pos > 10){
        _callback();
        return;
    }
    var currentDir = '';
    for(var i= 0; i <=pos; i++){
        if(i!=0)currentDir+='/';
        currentDir += dirArray[i];
    }
    fs.exists(currentDir,function(exists){
        if(!exists){
            fs.mkdir(currentDir,function(err){
                if(err){
                    // console.log(err);
                    // console.log('创建文件夹出错！'+ currentDir);
                }else{
                    // console.log(currentDir+'文件夹-创建成功！');
                    mkdir(pos+1,dirArray,_callback);
                }
            });
        }else{
            // console.log(currentDir+'文件夹-已存在！');
            mkdir(pos+1,dirArray,_callback);
        }
    });
}

//创建目录结构
function mkDirs(dirpath, _callback) {
    var dirArray = dirpath.split('/');
    fs.exists(dirpath ,function(exists){
        if(!exists){
            mkdir(0, dirArray,function(){
                // console.log('文件夹创建完毕!准备写入文件!');
                _callback();
            });
        }else{
            // console.log('文件夹已经存在!准备写入文件!');
            _callback();
        }
    });
}

module.exports = {
    sleep,
    getPageUrlList,
    parseObject,
    styleReg,
    scriptReg,
    mkDirs,
}