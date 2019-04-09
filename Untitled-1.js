// 获取地址栏参数的值
// let uuu = parseUrl(location.href),
//     ids = uuu.params.ids;
function parseUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

// 获取当前年月
function curYM() {
    let date = new Date();
    return date.getFullYear() + String(Number(date.getMonth()) + 1).padStart(2, '0');
}

// 对象的深拷贝
let deepCopy = (o, c) => {
    var c = c || {};
    for (let i in o) {
        if (toString.call(o[i]) === '[object Object]') {
            c[i] = {};
            deepCopy(o[i], c[i])
        } else if (toString.call(o[i]) === '[object Array]') {
            c[i] = [];
            deepCopy(o[i], c[i])
        } else {
            c[i] = o[i];
        }
    }
    return c;
}

// 保留两位小数（不强制），四舍五入
export const fixed2 = (str) => {
    if (/^\-|[\d\.]/g.test(str)) {
        let num = Number(str);
        if (num < 0) {
            num = -Math.round(num * -100) / 100;
        } else {
            num = Math.round(num * 100) / 100;
        }
        return num;
    } else {
        return str;
    }
}

// 将时间戳转换为北京时间格式
export let formatDate = (now) => {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    // var second=now.getSeconds(); 
    return year + "/" + month + "/" + date + " " + hour + ":" + minute;
}
// 获取今天日期
export let todayDate = () => {
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth();
    var nowDate = now.getDate();
    nowMonth = doHandleMonth(nowMonth + 1);
    nowDate = doHandleMonth(nowDate);
    return nowYear + "-" + nowMonth + "-" + nowDate;
}

function doHandleMonth(month) {
    if (month.toString().length == 1) {
        month = "0" + month;
    }
    return month;
}


// 时间格式转换成yyyy-mm-dd
export let handleDate = (item) => {
    var newItem = item.toString();
    var now = new Date(newItem);
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth();
    var nowDate = now.getDate();
    nowMonth = doHandleMonth(nowMonth + 1);
    nowDate = doHandleMonth(nowDate);
    return nowYear + "-" + nowMonth + "-" + nowDate;
}
// 时间格式转换为hh:mm:ss
export let handleTime = (item) => {
    var newItem = item.toString();
    var now = new Date(newItem);
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    hour = doHandleMonth(hour);
    minute = doHandleMonth(minute);
    second = doHandleMonth(second);
    return hour + ":" + minute + ":" + second;
}
// 将时间戳改成yyyy-mm-rr格式
export let formatDateMobile = (now) => {
    var year = now.getFullYear();
    var month = now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
    var date = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
    return year + "-" + month + "-" + date;
}