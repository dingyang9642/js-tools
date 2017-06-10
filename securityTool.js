/**
 * 1、xss攻击[各种参数问题]
 *    1.1 直接参数【前端防范】
 *       element.html/eval('url参数')
 *       <img src="{{ image_url }}">  ——> image_url= '" onload="alert(1)' ———> <img src="" onload="alert(1)">
 *       <input value=" {{ .... }} ">
 *    1.2 间接参数【后端防范】
 *       前端url参数 ———> 后台获取参数 ——> 页面渲染 ——> 攻击
 *    1.3 避免一切形式外链资源
 *       能避免则避免
 *       referr清洗
 * 2、csrf攻击【跨站伪造请求】
 *    2.1 前提：A网站登录、A网站种下cookie、登录B网站、B网站请求A网站资源
 *    2.2 防范：验证HTTP Referer字段
 *             在请求地址中添加token并验证
 *             在HTTP头中自定义属性并验证
 */   
var oSecurityTool = {
	/**
     * 过滤危险字符【xss攻击】
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    filterStr: function(str) {
        str = str + "";
        str = str.replace(/\;/g,"");
        str = str.replace(/\&/g,"&amp;");
        str = str.replace(/\</g,"&lt;");
        str = str.replace(/\>/g,"&gt;");
        str = str.replace(/\'/g,"");
        str = str.replace(/\-\-/g," ");
        str = str.replace(/\//g,"");
        return str;
    },

    /**
     * 获取url中的指定参数值[包含字符串危险字符过滤][xss攻击]
     * @param  {string} name [指定的查找字段]
     * @return {void}      [无]
     */
    getQueryString: function (name) {
        var self = this;
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return decodeURIComponent(self.filterStr(r[2])); return null;
    }

}