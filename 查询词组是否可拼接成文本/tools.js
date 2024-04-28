function getText(map, txtName) {  // 获取渲染的文字
    let str = '';
    if (map.size) { //如果map里有值
        str = `<span>能够拼接出 <b>${txtName}</b> 的文字，使用的词语及使用次数如下</span>
            </br>
            </br>
            <div style="width: 400px;max-height: 300px;overflow-y: auto;">`
        for (let [key, value] of map) {
            str += `${key}  ${value}次</br>`
        }
        str += '</div></br></br>'
    } else { //空值
        str = `<div>无法拼接出 <b>${txtName}</b> 的文字</div></br>`
    }
    return str;
}

function removePunctuation(txt) { //去除文段中的标点符号，得到只包含中文英文的纯文本
    let reg = /[^(\u4E00-\u9FA5|a-z|A-Z)]/g
    return txt.replace(reg, '');
}

Date.prototype.formatDate = function (fmt) { //格式化时间
    var o = {
        "M+": this.getMonth() + 1,                   //月份
        "d+": this.getDate(),                        //日
        "h+": this.getHours(),                       //小时
        "m+": this.getMinutes(),                     //分
        "s+": this.getSeconds(),                     //秒
        "S": this.getMilliseconds(),                 //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 请求资源
 * @param {Object} obj =>header:请求头；url:请求地址；methods:请求方法；data:请求参数
 * @returns {JSON} 
 * @returns {XML}
 */
const ajax = function (obj) {
    //返回promise对象
    return new Promise((res, rej) => {
        let xhr = null
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else {
            //兼容ie5、ie6
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (xhr.responseXML) {
                        res(JSON.parse(xhr.responseXML))
                    } else {
                        res(xhr.responseText)
                    }
                } else {
                    if (xhr.status == 404) throw '404,未找到文件资源'
                }
            } catch (e) {
                rej(e)
            }
        }

        //参数处理，当请求方式为get时，需要将参数加在请求地址后面。post则直接传参
        let data = '?'
        if (obj.data != undefined) {
            for (const key in obj.data) {
                data += key + '=' + obj.data[key] + '&'
            }
            data.substring(data.length - 1)
            obj.data = data
        }
        if (obj.methods == 'GET' || obj.methods == 'get') {
            obj.url += data
        }


        xhr.open(obj.methods, obj.url, true) //发起请求

        //对请求头进行处理
        if (obj.header != undefined) {
            let key = Object.keys(obj.header)
            xhr.setRequestHeader(key[0], obj.header[key[0]])
        }

        //发送请求
        xhr.send(obj.data)
    })
}