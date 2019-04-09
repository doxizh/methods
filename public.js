/**
 * Created by dxz on 2018/12/3.
 */

/**
 * 日期格式化
 * @param fmt
 * @returns {*}
 * @constructor
 * 例：new Date("2018/13/03 14:00:00").Format("yyyy-MM-dd hh:mm:ss")
 * 注意：微信内置浏览器new Date()不支持"-"，需使用"/"。
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 原生ajax请求
 * 类似jQuery，只支持简单的数据交互，不支持文件上传、jsonp等
 * @param opt
 * 后台接收json数据时需要设置contentType为"application/json;charset=UTF-8"
 */
function ajax(opt) {
    if (opt == null || typeof (opt) != "object") {
        console.log("参数错误！");
        return false;
    }
    opt.method = opt.method && opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async == "true";
    opt.contentType = opt.contentType || "application/x-www-form-urlencoded;charset=utf-8";
    opt.data = opt.data || null;
    opt.success = opt.success || function () {
        };
    opt.error = opt.error || function () {
        };
    opt.complete = opt.complete || function () {
        };
    var xmlHttp = null;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data) {
        if (opt.data.hasOwnProperty(key)) {
            params.push(key + '=' + opt.data[key]);
        }
    }
    var postData = params.join("&");
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            opt.complete();
            if (xmlHttp.status === 200) {
                opt.success(xmlHttp.responseText && JSON.parse(xmlHttp.responseText));
            } else {
                opt.error(xmlHttp);
            }
        }
    };
    if (opt.method == 'POST') {
        if (opt.contentType.indexOf("json") > -1) {
            postData = opt.data && JSON.stringify(opt.data);
        }
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', opt.contentType);
        xmlHttp.send(postData);
    }
    else if (opt.method === 'GET') {
        if (!!postData) {
            postData = '?' + postData;
        }
        xmlHttp.open(opt.method, opt.url + postData, opt.async);
        xmlHttp.send(null);
    }
}

/**
 * 获取url指定参数的值
 * 没有转码，如果需要转码可使用decodeURIComponent()对获取值进行转码
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}

/**
 * cookie设置
 * Cookie: NAME=VALUE；Expires=DATE；Path=PATH；Domain=DOMAIN_NAME；SECURE
 * @param name Cookie的名称
 * @param value Cookie的值
 * @param opts 可省略
 * opts={
 *      expires: Number, // Cookie有效终止日期,单位：小时
 *      path: '', // Web服务器上哪些路径下的页面可获取服务器设置的Cookie。
 *      domain: '', // 确定了哪些Internet域中的Web服务器可读取浏览器所存取的Cookie
 *      secure: Boolean, // 只有当浏览器和Web Server之间的通信协议为加密认证协议时，浏览器才向服务器提交相应的Cookie。当前这种协议只有一种，即为HTTPS。
 * }
 *
 * @returns {*}
 */
function cookie(name, value, opts) {
    if (typeof value !== 'undefined') {
        var expires = '';
        opts = opts || {};
        if (value === null) {
            value = '';
            opts.expires = -1;
        }
        if (opts.expires) {
            var date = new Date();
            date.setTime(date.getTime() + (opts.expires * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        var path = opts.path ? '; path=' + opts.path : '';
        var domain = opts.domain ? '; domain=' + opts.domain : '';
        var secure = opts.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookies;
        if (document.cookie && document.cookie !== '') {
            cookies = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
            if (cookies) {
                return cookies[2];
            } else {
                return null;
            }
        }
    }
}

/**
 * 保留指定位小数（向上取值或向下取值）
 * @param num 必填，数据类型为字符串或数字
 * @param count 必填，保留多少位小数
 * @param up 选填，真值为向上保留小数，不填或假值为向下保留小数
 * @returns {*}
 */
function getNum(num, count, up) {
    count = Number(count);
    num = Number(num);
    if (isNaN(count) || isNaN(num)) {
        console.log("参数错误！");
        return false;
    }
    if (!!up) {
        var retain = Math.pow(10, count + 1);
        num = (num * (retain) + 9) / retain + "";
        return Number(num.substring(0, num.indexOf('.') + count + 1));
    } else {
        num += "";
        return Number(num.substring(0, num.indexOf('.') + count + 1));
    }
}

/**
 * 滚动条在Y轴上的滚动距离
 * @returns {number}
 */
function getScrollTop() {
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

/**
 * 文档的总高度
 * @returns {number}
 */
function getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

/**
 * 浏览器视口的高度
 * @returns {number}
 */
function getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

/**
 * 判断是否已经加载了指定js
 * @param url
 * @returns {boolean}
 */
function hasScript(url) {
    var scripts = document.getElementsByTagName("script");
    if (!scripts || scripts.length == 0) return false;
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (src && url == src) {
            return true;
        }
    }
    return false;
}

/**
 * 加载js
 * @param url
 * @param callback
 */
function loadScript(url, callback) {
    if (!url) {
        return;
    }
    if (hasScript(url)) {
        return;
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) { // IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback && callback();
            }
        };
    } else { // FF, Chrome, Opera, ...
        script.onload = function () {
            callback && callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/**
 * 加载css
 * @param url
 */
function loadStyle(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    head.appendChild(link);
}

/**
 * 查询指定class的元素
 * @param tagName 标签名
 * @param className class名
 * @returns {*} 返回一个数组
 */
function getClass(tagName, className) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(className);
    } else {
        var tags = document.getElementsByTagName(tagName);
        var tagArr = [];//用于返回类名为className的元素
        for (var i = 0; i < tags.length; i++) {
            var classList = tags[i].className.split(' ');
            if (classList.indexOf(className) != -1) {
                tagArr[tagArr.length] = tags[i];
            }
        }
        return tagArr;
    }
}

/**
 * 判断指定元素是否含有某个class
 * @param obj
 * @param cls
 * @returns {*|string|Array|{index: number, input: string}}
 */
function hasClass(obj, cls) {
    return obj && obj.className && cls && obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * 为指定元素添加class
 * @param obj
 * @param cls
 */
function addClass(obj, cls) {
    if (!obj || !cls) return;
    if (!hasClass(obj, cls)) obj.className += " " + cls;
}

/**
 * 移除指定元素class
 * @param obj
 * @param cls
 */
function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, "");
    }
}

/**
 * 切换指定元素class
 * @param obj
 * @param cls
 */
function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}