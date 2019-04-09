/*
* 功能
*     格式化小数  位数不足 用0补齐
* 参数
*     str: 需要格式化的对象
*     figure: 保留的小数位数 默认格式化两位
* */
export const toFixed = (str, figure = 2) => {
    if (/^\-|[\d\.]/g.test(str)) {
        let num = Number(str),
            _length;

        //  保留figure位小数
        if (num < 0) {
            num = -Math.round(num * -Math.pow(10, figure)) / Math.pow(10, figure);
        } else {
            num = Math.round(num * Math.pow(10, figure)) / Math.pow(10, figure);
        }
        if(figure == 0) {
            return num
        }
        // 判断小数点位数是否 足位
        let _decimals = num.toString().split('.')[1];
        if (_decimals == undefined) {
            // 整数   补齐小数位数
            num += '.';
            for (let i = 0; i < figure; i++) {
                num += '0'
            }
        } else {
            // 小数 位数不够 补齐小数位数
            _length = _decimals.length;
            if (_length < figure) {
                for (let i = 0; i < figure - _length; i++) {
                    num += '0'
                }
            }
        }
        return num;
    } else {
        return str;
    }
}

/*
* 功能
*    去除首尾空格
* 参数
*     text: 需要处理的对象
* */
export const trim = function (text) {
    if (typeof (text) == "string") {
        return text.replace(/^\s*|\s*$/g, "");
    } else {
        return text;
    }
}

//获取和设置会话存储
export const getSession = (name) => {
    return JSON.parse(sessionStorage.getItem(name));
}
export const setSession = (name, val) => {
    sessionStorage.setItem(name, JSON.stringify(val));
}

/*
* 功能
*     获取本地存储(仅供历史记录使用)
* 参数
*     name:  本地存储的key
* */
export const getLocalHistory = (name) => {
    let historyList = localStorage.getItem(name);
    if (historyList === null) return [];
    return JSON.parse(historyList);
}

/*
* 功能
*     设置本地存储的历史记录
* 参数
*     obj： 新增设置的数组的项
*     name： 本地存储的key
*     length： 历史记录的条数  默认只存储4条
*     key： 历史记录每一项要显示的字段名
* */
export const setLocalHistory = ({obj, name, length = 4, key}) => {
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
* 功能
*     身份证校验规则
* 参数
*     id: 身份证号码
* */
export const identityCodeValid = (id) => {
    //号码规则校验
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    if (!format.test(id)) {
        return false;
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6, 4),//身份证年
        month = id.substr(10, 2),//身份证月
        date = id.substr(12, 2),//身份证日
        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year, month, 0)).getDate();//身份证当月天数
    if (time > now_time || date > dates) {
        return false;
    }
    //校验码判断
    var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
    var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for (var k = 0; k < 17; k++) {
        sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
        return false;
    }
    return true;
}

/*
* 功能：
*   身份证号码隐藏/手机号码隐藏
* 参数：
*   num:  号码
*   type:
*       'ID': 身份证号码
*       'Phone': 手机号码
* */
export const hideNumber = (num, type) => {
    if (num == undefined) {
        return
    }
    ;

    if (typeof num == 'number') {
        num = num.toString()
    }
    ;

    let result;
    switch (type) {
        case 'ID':
            result = hide(3, 2);
            break;
        case 'Phone':
            result = hide(3, 4)
            break;
        default:
            alert('请输入正确的格式化对象类型');
            break;
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


/*
* 功能：
*   年月过滤 默认显示年月   不显示日
* 参数：
*   value: 日期值
*          格式    new Date()  ||  20180209
*   showDay:  是否显示日  默认 false
* */
export const formateDate = (value, showDay = false) =>  {
    let _year,
        _month,
        _day;
    if (value !== null && typeof value === 'object') {
        _year = value.getFullYear();
        _month = value.getMonth() + 1;
        _day = value.getDate();
    } else if (!isNaN(Number(value))) {
        value = value.toString();
        _year = value.substring(0, 4);
        _month = value.substring(4, 6);
        _day = value.substring(6, 8);
    } else {
        alert('数据格式不正确');
        return
    }
    if (showDay) {
        return `${_year}年${_month}月${_day}日`
    } else {
        return `${_year}年${_month}月`
    }
}

/*
*  功能
*      获取 url 指定参数的值
*  参数
*      name: 指定的参数名   必填项
*      url: 页面路径  可选值  不填则默认当前页面
*/
export const getQueryString = (name, url = location.href) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
        r = url.split('?')[1].match(reg);
    if (!!r) {
        return decodeURIComponent(r[2]);
    }
    return null;
}

/*
*  功能
*       原生ajax封装
*  参数
*  options = {
*       url: ''
*       type: 'GET' || 'POST'
*       data: {}
*       async: true   // 默认是true
*       complete: function(){}   回调函数
*       success: function(){}    成功的回调函数
*       error: function(){}      失败的回调函数
*  }
*/
export const ajax = (options) => {
    let xhr = null,
        params = formsParams(options.data),
        async = true;

    if (options.async && options.async == 'false') {
        async = false;
    }
    //创建对象
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 连接
    if (options.type == "GET") {
        xhr.open(options.type, options.url + "?" + params, async);
        xhr.send();
    } else if (options.type == "POST") {
        xhr.open(options.type, options.url, async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
    xhr.onreadystatechange = function () {
        options.complete && options.complete();
        if (xhr.readyState == 4 && xhr.status == 200) {
            options.success && options.success(xhr.responseText);
        } else {
            options.error && options.error(xhr.responseText);
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

/*
* 功能
*    手机号码正确性检测
* 参数
*    phone  手机号码  必填项
* */
export const checkPhoneFn = (phone) => {
    let reg = /^1[0-9]{10}$/;
    if (!reg.test(phone)) {
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

/*
* 功能
*    邮箱正确性检测
* 参数
*    mail  邮箱  必填项
* */
export const checkMailFn = (mail) => {
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!reg.test(mail)) {
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