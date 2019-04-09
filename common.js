// ------------時間處理函數--------------


// 时间格式转换成yyyy-mm-dd
export let timeStampToTime = (item) =>{
    var date = new Date(item);
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;  
    second = second < 10 ? ('0' + second) : second; 
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  

}







// ------------地址欄處理函數--------------


// 从地址栏拿到某个query参数的值
export let getQueryString = (name)=> {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}









// ------------校驗類型函數--------------


// 身份证校验规则
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





  
// ------------數據處理函數--------------


   /**
	 * 保留小位点 
	 * @param f 要處理的數据
	 * @param size 保留的小數位
	 */
// 保留小位点 多了截取 少了补0  例如传参 formatFloat(555.33,3)  返回555.330
export const formatFloat=(f, size)=> {
    var varchar = "";
    if (f == null || isNaN(f))
        f = "0";

    let aa = f.toString().split("");
    var num = 0, k = 0; //num是已得小数点位数，K用来作是否到小数点控制
    for (var i = 0; i < aa.length; i++) {
        varchar += aa[i];
        if (aa[i] == ".") {
            k = 1;
        } 
        if (k == 1) {
            num++;
            if (num > size) break;

        }
    }
    num--;
    for (; num < size; num++) //如果位数不够，则补0
    {
        if (num == -1) {
            varchar +='.'
        } else {
            varchar += "0";

        }
    }

    return varchar;
}


// 千进制显示
export const toThousands= (data)=>{
    let num = Number(data).toFixed();
    let result = '';
    num = (num || 0).toString();
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

// 保留两位小数，整数后面加‘.00’
export const toFixed = (data) =>{
    let str = String(data);
    if(str.indexOf('.') > -1 && data != '0'){
        return data.toFixed(2);
    }else{
        return data + '.00';
    }
}


 /**
	 * 字母大小写切换
	 * @param str 要处理的字符串
	 * @param type 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
	 */
    export const strChangeCase =(str,type)=>{
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






// ------------數組處理函數--------------


// 去重ES6写法
export const unique1 = (arr)=> {
    return  Array.from(new Set(arr))
}

// 普通数组去重方法2  1 和 '1' 只留下1 
export const  unique2 = (arr)=>{
    　　var res =[] ,obj = {};
    　　for(var i=0;i<arr.length;i++){

        　　　　if(!obj[arr[i]]){

        　　　　　　 res.push(arr[i]);
                    obj[arr[i]] = '已存在';
        　　　　}
    　　}
    　　return res;
}
// 普通数组去重方法3  1 和 '1' 都會留下
export const  unique3 = (arr)=>{
    　　var newArr = [arr[0]];
    　　 for(var i=1;i<arr.length;i++){
    　　　　if(newArr.indexOf(arr[i]) == -1){
            　　 newArr.push(arr[i]);
        　　  }
        }
    return newArr;
}


 /**
	 * 簡單數組排序
	 * @param arr 要处理的字符串
	 * @param type 1 降序 0 升序
	 */
export const sortArr = (arr,type)=>{
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
	 * 返迴數組的最大最小值
	 * @param arr 要处理的數組
	 * @param type 1返迴最大值 0返迴最小值
	 */
export const compareArr = (arr,type)=>{
    if(type==1){
        return Math.max.apply(null,arr);
    }else{
        return Math.min.apply(null,arr);
    }
}




// --------------倒計時---------------------------
/**
	 * 倒计时（默认开始时间为当前时间）
	 * @param endTime 结束时间
	 * @returns 例：剩余时间1天 16小时 45 分钟41 秒
	*/
    export const getEndTime = (endTime)=>{
	    var startDate=new Date();  //开始时间，当前时间
	    var endDate=new Date(endTime); //结束时间，需传入时间参数
	    var t=endDate.getTime()-startDate.getTime();  //时间差的毫秒数
	    var d=0,h=0,m=0,s=0;
	    if(t>=0){
	      d=Math.floor(t/1000/3600/24);
	      h=Math.floor(t/1000/60/60%24);
	      m=Math.floor(t/1000/60%60);
	      s=Math.floor(t/1000%60);
	    } 
	    return "剩余时间"+d+"天 "+h+"小时 "+m+" 分钟"+s+" 秒";
    }
    
    // 通常和搭配使用 setInterval(getEndTime, 1000);