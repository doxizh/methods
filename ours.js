// ------------------------ 模块一：地址栏url相关---------------------------
/*
*  功能：
*      解析地址栏链接全部信息
*  @params  
*      url: 地址栏链接
*/
const parseUrl = (url) => {
    let a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            let ret = {},
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

/*
*  功能：
*      获取 url 指定参数的值
*  @params
*       name: 指定的参数名   必填项
*       url: 页面路径  可选值  不填则默认当前页面
*/
const getQueryString = (name, url = location.href) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
        r = url.split('?')[1].match(reg);
    if (!!r) {
        /*
            这些URI方法 encodeURI、encodeURIComponent()、decodeURI()、decodeURIComponent() 代替了 BOM 的 escape() 和 unescape() 方法。
            URI方法更可取，因为它们对所有Unicode符号编码,
            而BOM方法只能对ASCII符号正确编码。尽量避免使用escape()和unescape()方法。
        */
        // return unescape(r[2])
        return decodeURIComponent(r[2]);
    }
    return null;
}

// ------------------------ 模块二：原生ajax封装---------------------------
/*
*  功能
*       原生ajax封装 仅支持 get  ||  post 方式
*  @params
*       options = {
*           url: ''                     必填项
*           type: 'GET' || 'POST'       非必填项 默认 POST
*           data: {}                    必填项
*           async: true                 默认是true
*           complete: function(){}   回调函数
*           success: function(){}    成功的回调函数
*           error: function(){}      失败的回调函数
*       }
*/
const ajax = (options) => {

    if (options == null || typeof (options) != "object") {
        console.log("参数错误！");
        return false;
    }
    //  设置默认选项值
    let opts= {
        url: options.url || '',
        type: options.type || 'POST',
        data:  options.data || null,
        async:  options.async || true,
        contentType:  options.contentType || "application/x-www-form-urlencoded;charset=utf-8",
        complete: options.complete || function(){},
        success: options.success || function(){},
        error: options.error || function(){}
    },
        xhr = null,
        params = formsParams(opts.data);

    //创建对象
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 连接
    if (opts.type == "GET") {
        xhr.open(opts.type, opts.url + "?" + params, opts.async);
        xhr.send(null);
    } else if (opts.type == "POST") {
        xhr.open(opts.type, opts.url, opts.async);
        xhr.setRequestHeader("Content-Type", opts.contentType);
        xhr.send(params);
    }
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 ) {
            opts.complete && opts.complete();
            if ( xhr.status == 200) {
                opts.success && opts.success(xhr.responseText);
            } else {
                opts.error && opts.error(xhr.responseText);
            }
        }
    };

    function formsParams(data) {
        if (data) {
            let arr = [];
            for (let prop in data) {
                arr.push(prop + "=" + data[prop]);
            }
            return arr.join("&");
        }
        return {};
    }
}

// ------------------------ 模块三：日期date相关---------------------------

/*
*  功能：
*      日期格式化 Date 原型链的扩展
*  @params
*      fmt:   需要的日期格式    例： new Date("2018/13/03 14:00:00").Format("yyyy-MM-dd hh:mm:ss")
*/
Date.prototype.Format = function (fmt) {
    let o = {
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
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/*
*  功能：
*      获取当前年月  ==> '201809'
*  @params
*      无
*  说明： padStart  es7 新增字符窜补全方法  有兼容性问题   建议使用 formatDate 方法
*/
const curYM = () => {
    let date = new Date();

    if (String().padStart) {
        return date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0');
    }
    return date.getFullYear() + (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + date.getMonth() + 1;
}

/*
*  功能：
*      将时间戳转换为北京时间格式
*  @params
*      options 对象
*      {
*           item: 时间戳    默认取当前时间
*           type: 返回格式  默认值是 0
*                 0：'2018/12/12 00:00:00'
*                 1: '2018/12/12'
*                 2: '2018-12-12'
*                 3: '00:00:00'
*                 4: '20181212'
*                 5: '2018年12月12日 00时00分00秒'
*                 6: '2018年12月12日'
*                 7: '2018年12月'
*      }
*/
const formatDate = (options) => {
    let date = (options.data&&new Date(options.date)) || new Date(),
        type = (options.type&&options.type) || 0,
        _date = new Date(date),
        _year = _date.getFullYear().toString(),
        _month = _date.getMonth() + 1 > 9 ? _date.getMonth() + 1 : '0' + (_date.getMonth() + 1),
        _day = _date.getDate() > 9 ? _date.getDate() : '0' + _date.getDate(),
        _hours = _date.getHours() > 9 ? _date.getHours() : '0' + _date.getHours(),
        _minutes = _date.getMinutes() > 9 ? _date.getMinutes() : '0' + _date.getMinutes(),
        _seconds = _date.getSeconds() > 9 ? _date.getSeconds() : '0' + _date.getSeconds();

    switch (type) {
        case 0:
            return _year + '/' + _month + '/' + _day + ' ' + _hours + ':' + _minutes + ':' + _seconds;
            break;
        case 1:
            return _year + '/' + _month + '/' + _day;
            break;
        case 2:
            return _year + '-' + _month + '-' + _day;
            break;
        case 3:
            return _hours + ':' + _minutes + ':' + _seconds;
            break;
        case 4:
            return _year + _month + _day;
            break;
        case 5:
            return _year + '年' + _month + '月' + _day + '日' + ' ' + _hours + '时' + _minutes + '分' + _seconds + '秒';
            break;
        case 6:
            return _year + '年' + _month + '月' + _day + '日';
            break;
        case 7:
            return _year + '年' + _month + '月';
            break;
    }
}

/**
 * 2018/12/5
 * 倒计时（默认开始时间为当前时间）
 * @param endTime 结束时间
 * @returns {string} 例：剩余时间1天 16小时 45 分钟41 秒
 */
const getEndTime = (endTime)=>{
    let startDate=new Date(),  //开始时间，当前时间
     endDate=new Date(endTime), //结束时间，需传入时间参数
     t=endDate.getTime()-startDate.getTime(),  //时间差的毫秒数
     d=0,h=0,m=0,s=0;
    if(t>=0){
        d=Math.floor(t/1000/3600/24);
        h=Math.floor(t/1000/60/60%24);
        m=Math.floor(t/1000/60%60);
        s=Math.floor(t/1000%60);
    }
    return "剩余时间"+d+"天 "+h+"小时 "+m+" 分钟"+s+" 秒";
}

// ------------------------ 模块四：对象Object相关---------------------------
/*
*  功能：
*      对象的深拷贝
*  @params
*       o: 被拷贝对象
*       c: 求同存异
*  表现形式
*   deepCopy({a:1},{c:2})
    {c: 2, a: 1}
    deepCopy({a:1},{a:2,c:2})
    {a: 1, c: 2}
    deepCopy({a:1,c:1},{a:2,c:2})
    {a: 1, c: 1}
    deepCopy({a:1,c:1},{d:1})
    {d: 1, a: 1, c: 1}
    deepCopy({a:1,c:1},[d:1])
    deepCopy({a:1,c:1},[1])
    [1, a: 1, c: 1]
*/
const deepCopy = (o, c) => {
    c = c || {};
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

// ------------------------ 模块五：数据操作相关---------------------------
/*
*  功能：
*      格式化小数  四舍五入  位数不足 用0补齐
*  @params
*      num: 需要格式化的数据 字符窜或者数字类型  必填项
*      figure： 需要保留的小数位数  非必填项  默认值 2
*/
const toFixed = (num, figure = 2) => {
    if (/^\-|[\d\.]/g.test(num)) {
        let _num = Number(num),
            _length;
        //  保留figure位小数
        if (_num < 0) {
            _num = -Math.round(_num * -Math.pow(10, figure)) / Math.pow(10, figure);
        } else {
            _num = Math.round(_num * Math.pow(10, figure)) / Math.pow(10, figure);
        }
        if(figure == 0) {
            return num
        }
        // 判断小数点位数是否 足位
        let _decimals = _num.toString().split('.')[1];
        if (_decimals == undefined) {
            // 整数   补齐小数位数
            _num += '.';
            for (let i = 0; i < figure; i++) {
                _num += '0'
            }
        } else {
            // 小数 位数不够 补齐小数位数
            _length = _decimals.length;
            if (_length < figure) {
                for (let i = 0; i < figure - _length; i++) {
                    _num += '0'
                }
            }
        }
        return _num;
    } else {
        return num;
    }
}

/*
*  功能：
*      格式化小数 向上或者向下取值
*  @params
*      num： 字符窜或者数字类型   必填项
*      count: 保留的小数位数     必填项
*      up:   真值或者布尔值   默认向上保留小数    选填项
*/
const getNum = (num, count, up) =>{
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

/*
*  功能：
*      千进制数据格式显示
*  @params
*      data: 需要格式化的数据
*/
const toThousands= (data)=>{
    if(data == null || isNaN(data)) {
        console.log('参数错误！');
        return false
    }

    let num = Number(data).toFixed(),
        result = '';
    num = num.toString();
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

/**
 * 2018/12/5
 * 字符串大小写切换
 * @param str 要处理的字符串
 * @param type 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
 * @return str
 */
const strChangeCase =(str,type)=>{
    function ToggleCase(str) {
        var itemText = ""
        str.split("").forEach(
            function (item) {
                if (/^([a-z]+)/.test(item)) {
                    itemText += item.toUpperCase();
                }
                else if (/^([A-Z]+)/.test(item)) {
                    itemText += item.toLowerCase();
                }
                else{
                    itemText += item;
                }
            });
        return itemText;
    }

    switch (type) {
        case 1:
            return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
                return v1.toUpperCase() + v2.toLowerCase();
            });
        case 2:
            return str.replace(/^(\w)(\w+)/, function (v, v1, v2) {
                return v1.toLowerCase() + v2.toUpperCase();
            });
        case 3:
            return ToggleCase(str);
        case 4:
            return str.toUpperCase();
        case 5:
            return str.toLowerCase();
        default:
            return str;
    }
}
// ------------------------ 模块六：存储模块---------------------------
/**
*  获取和设置回话存储
*  @params key
*  @params value
*/
const getSession = (name) => {
    return JSON.parse(sessionStorage.getItem(name));
}
const setSession = (name, val) => {
    sessionStorage.setItem(name, JSON.stringify(val));
}

/*
*  功能：
*      获取本地存储(仅供历史记录使用)
*  @params
*      name:  本地存储的key
*/
const getLocalHistory = (name) => {
    let historyList = localStorage.getItem(name);
    if (historyList === null) return [];
    return JSON.parse(historyList);
}

/*
*  功能：
*      设置本地存储的历史记录
*  @params
*      obj： 新增设置的数组的项
*     name： 本地存储的key
*   length： 历史记录的条数  默认只存储4条
*      key： 历史记录每一项要显示的字段名
*/
const setLocalHistory = ({obj, name, length = 4, key}) => {
    let oldList = getLocalHistory(name);
    let item = key ? obj[key] : obj;
    for (let i = 0; i < oldList.length; i++) {
        let oldItem = key ? oldList[i][key] : oldList[i];
        if (oldItem == item) {
            oldList.splice(i, 1);
            i--;
        }
    }
    if (oldList.length >= length) {
        oldList.splice(oldList.length - 1, 1);
    }
    oldList.unshift(obj);
    localStorage.setItem(name, JSON.stringify(oldList));
}

/*
*  功能：
*      cookie设置
*  @params
*     name:  cookie key值
*     value  cookie value值
*     opts: {
*           expires: Number, // Cookie有效终止日期,单位：小时
*           path: '', // Web服务器上哪些路径下的页面可获取服务器设置的Cookie。
*           domain: '', // 确定了哪些Internet域中的Web服务器可读取浏览器所存取的Cookie
*           secure: Boolean, // 只有当浏览器和Web Server之间的通信协议为加密认证协议时，浏览器才向服务器提交相应的Cookie。当前这种协议只有一种，即为HTTPS。
*     }
*/
const cookie = (name, value, opts) => {
    if (typeof value !== 'undefined') {
        let expires = '';
        opts = opts || {};
        if (value === null) {
            value = '';
            opts.expires = -1;
        }
        if (opts.expires) {
            let date = new Date();
            date.setTime(date.getTime() + (opts.expires * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        let path = opts.path ? '; path=' + opts.path : '',
            domain = opts.domain ? '; domain=' + opts.domain : '',
            secure = opts.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        let cookies;
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

// ------------------------ 模块、七：表单模块---------------------------
/**
 * 2018/12/5
 * 身份证校验规则
 * @param id 身份证号码
 */
const identityCodeValid = (id) => {
    //号码规则校验
    let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    if (!format.test(id)) {
        return false;
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    let year = id.substr(6, 4),//身份证年
        month = id.substr(10, 2),//身份证月
        date = id.substr(12, 2),//身份证日
        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year, month, 0)).getDate();//身份证当月天数
    if (time > now_time || date > dates) {
        return false;
    }
    //校验码判断
    let c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2),   //系数
     b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'),  //校验码对照表
     id_array = id.split(""),
     sum = 0;
    for (let k = 0; k < 17; k++) {
        sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
        return false;
    }
    return true;
}

/**
 * 2018/12/5
 * 身份证号码处理/手机号码隐藏
 * @param num：  手机号    //   身份证号码  必填项
 * @param type:    0      //    1         必填项
 */
const hideNumber = (num, type) => {
    if (num == undefined || isNaN(num)) {
        console.log('参数错误！')
        return false
    };

    if (typeof num == 'number') {
        num = num.toString()
    };

    let result;
    switch (type) {
        case 0:
            result = hide(3, 4)
            break;
        case 1:
            result = hide(3, 2);
            break;

        default:
            return false
    }
    return result;
    function hide(frontLen, endLen) {
        let _frontLen = frontLen,
            _len,
            _xing = '',
            _endLen = endLen;
        _len = num.length - _frontLen - _endLen;
        for (let i = 0; i < _len; i++) {
            _xing += '*';
        }
        return num.substring(0, _frontLen) + _xing + num.substring(num.length - _endLen);
    }
}

/**
 * 2018/12/5
 * 手机号码正确性校验
 * @param   phone   手机号码  必填项
 * @returns { status: boolean, msg: string }
 */
const checkPhoneFn = (phone) => {
    let reg = /^1[0-9]{10}$/;
    if (!reg.test(phone).replace(/\s/g, '')) {
        return {
            status: false,
            msg: '您的手机号不符合格式，请重新输入'
        }
    }
    return {
        status: true,
        msg: ''
    }
}

/**
 * 2018/12/5
 * 邮箱正确性校验
 * @param mail     邮箱     必填项
 * @returns { status: boolean, msg: string }
 */
const checkMailFn = (mail) => {
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!reg.test(mail.replace(/\s/g,''))) {
        return {
            status: false,
            msg: '您的邮箱不符合格式，请重新输入'
        }
    }
    return {
        status: true,
        msg: ''
    }
}

// ------------------------ 模块、八：数组扩展模块---------------------------
/**
 * 2018/12/5
 * 数组去重  方案一
 * @param arr
 * @return arr
 */
const unique1 = (arr)=> {
    return  Array.from(new Set(arr))
}
/**
 * 2018/12/5
 * 数组去重  方案二   1 和 '1' 只留下1
 * @param  arr
 * @return arr
 */

const  unique2 = (arr)=>{
    let res =[] ,
        obj = {};

    for(let i=0;i<arr.length;i++){
        if(!obj[arr[i]]){
            res.push(arr[i]);
            obj[arr[i]] = '已存在';
        }
    }
    return res;
}

/**
 * 2018/12/5
 * 数组去重  方案三   1 和 '1' 都留下
 * @param x
 */
const  unique3 = (arr)=>{
    let newArr = [arr[0]];
    for(let i=1;i<arr.length;i++){
        if(newArr.indexOf(arr[i]) == -1){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

/**
 * 2018/12/5
 * 数组排序
 * @param arr
 * @param type  0 升序  1 降序  默认升序
 */
const sortArr = (arr,type=0)=>{
    if(type==1){
        //降序
        arr.sort(function(a,b){
            return b-a ;
        }) ;
    }else{
        arr.sort(function(a,b){
            return a-b ;
        }) ;
    }
    return arr ;
}

/**
 * 2018/12/5
 * 返回数组最大最小值
 * @param arr
 * @param type: 0  最小值； 1： 最大值  默认返回最小值
 */
const compareArr = (arr,type=0)=>{
    if(type==1){
        return Math.max.apply(null,arr);
    }else{
        return Math.min.apply(null,arr);
    }
}

// ------------------------ 模块九：文档 对象模块---------------------------
/**
 * 2018/12/5
 * 滚动条在Y轴上的滚动距离
 * @return {number}
 */
const getScrollTop = () => {
    let scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
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
 * 2018/12/5
 * 文档总高度
 * @return {number}
 */
const getScrollHeight = () => {
    let scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
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
 * 2018/12/5
 * 浏览器视口的宽度
 * @return {number}
 */
const getWindowHeight = () => {
    let windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

// ------------------------ 模块十：文件加载模块---------------------------
/**
 * 2018/12/5
 * 判断是否已经加载了指定js
 * @param url
 * @return {boolean}
 */
const hasScript = (url) => {
    let scripts = document.getElementsByTagName("script");
    if (!scripts || scripts.length == 0) return false;
    for (let i = 0; i < scripts.length; i++) {
        let src = scripts[i].src;
        if (src && url == src) {
            return true;
        }
    }
    return false;
}

/**
 * 2018/12/5
 * 动态加载js
 * @param url
 * @param callback
 */
const loadScript = (url, callback) => {
    if (!url) {
        return;
    }
    if (hasScript(url)) {
        return;
    }
    let script = document.createElement("script");
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
 * 2018/12/5
 * 动态加载css
 * @param url
 */
const loadStyle = (url) => {
    let head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    head.appendChild(link);
}

/**
 * 2018/12/5
 * 查询指定class的元素
 * @param tagName 标签名
 * @param className class名
 * @returns {*} 返回一个数组
 */
const getClass = (tagName, className) => {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(className);
    } else {
        let tags = document.getElementsByTagName(tagName),
            tagArr = [];//用于返回类名为className的元素
        for (let i = 0; i < tags.length; i++) {
            let classList = tags[i].className.split(' ');
            if (classList.indexOf(className) != -1) {
                tagArr[tagArr.length] = tags[i];
            }
        }
        return tagArr;
    }
}

/**
 * 2018/12/5
 * 判断指定元素是否含有某个class
 *  @param obj
 *  @param cls
 *  @returns {*|string|Array|{index: number, input: string}}
 */
const hasClass = (obj, cls) => {
    return obj && obj.className && cls && obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * 2018/12/5
 * 为指定元素添加class
 * @param obj
 * @param cls
 */
const addClass = (obj, cls) => {
    if (!obj || !cls) return;
    if (!hasClass(obj, cls)) obj.className += " " + cls;
}

/**
 * 2018/12/5
 * 移除指定元素class
 * @param obj
 * @param cls
 */
const  removeClass = (obj, cls) => {
    if (hasClass(obj, cls)) {
        let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, "");
    }
}

/**
 * 2018/12/5
 * 切换指定元素class
 * @param obj
 * @param cls
 */

const toggleClass = (obj, cls) => {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}