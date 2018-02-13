(function(win){
    /**
     * [cookieUtil 操作cookie
     * @type {Object}
     */
    var cookieUtil = {
        /**
         * 增加cookie
         * @param {string} name       cookie名称
         * @param {string} value      值
         * @param {number} expireTime 过期时间，ms
         */
        setCookie:function(name, value, expireTime, path){
            var cookiePath = path ? (";path=" + path) : "";
            var exp = new Date();
            exp.setTime(exp.getTime() + expireTime);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + cookiePath;
        },
        /**
         * 获取cookie
         * @param  {string} name cookie名称
         * @return {string}      值
         */
        getCookie:function(name){
            var arr;
            var reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            }else{
                return null;
            }
            return null;
        },

        /**
         * 删除cookie
         * @param  {string} name cookie名称
         */
        delCookie:function(name, path){
            var exp = new Date();
            var cookiePath = path ? (";path=" + path) : "";
            exp.setTime(exp.getTime() - 1000000);
            var cval=cookieUtil.getCookie(name);
            if(cval !== null) {
                document.cookie= name + "="+cval+";expires="+exp.toGMTString() + cookiePath;
            }
        }
    };
    /**
     * 手机横竖屏翻转事件添加与移除（默认已存在横竖屏翻转刷新页面）
     * @type {Object}
     */
    var orientationChange = {
        events: {},//给页面初始化一个翻凭函数，即强制页面刷新
        init: false,
        addEvent: function (id, fun) {
            if(orientationChange.events[id]) {
                return false;
            }
            orientationChange.events[id] = fun;
            if(!orientationChange.init) {
                orientationChange.initOrientCommand();
            }
            return true;
        },
        removeEventById: function (id) {
            if(orientationChange.events[id]) {
                delete orientationChange.events[id];
                return true;
            }
            return false;
        },
        initOrientCommand: function () {
            /* 在用户变化屏幕显示方向的时候调用*/
            window.addEventListener('orientationchange', function(e){
                for(var key in orientationChange.events){
                    var tmpFunc = orientationChange.events[key];
                    tmpFunc();
                }
            }, false);
            orientationChange.init = true;
        }
    };
    /**
     * 为window绑定click事件
     * @type {Object}
     */
    var bodyClickEventUtil = {
        events: {},//给页面初始化一个翻凭函数，即强制页面刷新
        init: false,
        addEvent: function (id, fun) {
            if(bodyClickEventUtil.events[id]) {
                return false;
            }
            bodyClickEventUtil.events[id] = fun;
            if(!bodyClickEventUtil.init) {
                //执行一次绑定即可
                bodyClickEventUtil.initClickCommand();
            }
            return true;
        },
        removeEventById: function (id) {
            if(bodyClickEventUtil.events[id]) {
                delete bodyClickEventUtil.events[id];
                return true;
            }
            return false;
        },
        initClickCommand: function () {
            /* 在用户变化屏幕显示方向的时候调用*/
            $(window).bind( 'click', function(e){
                for(var key in bodyClickEventUtil.events){
                    var tmpFunc = bodyClickEventUtil.events[key];
                    tmpFunc(e);
                }
            });
            bodyClickEventUtil.init = true;
        }
    };
    /**
     * 为window绑定click事件
     * @type {Object}
     */
    var windowLoadEventUtil = {
        events: {},//给页面初始化一个翻凭函数，即强制页面刷新
        init: false,
        addEvent: function (id, fun) {
            if(windowLoadEventUtil.events[id]) {
                return false;
            }
            windowLoadEventUtil.events[id] = fun;
            if(!windowLoadEventUtil.init) {
                //执行一次绑定即可
                windowLoadEventUtil.initLoadCommand();
            }
            return true;
        },
        removeEventById: function (id) {
            if(windowLoadEventUtil.events[id]) {
                delete windowLoadEventUtil.events[id];
                return true;
            }
            return false;
        },
        initLoadCommand: function () {
            /* 在用户变化屏幕显示方向的时候调用*/
            //$(window).bind( 'load', function(e){
            window.onload = function () {
                for(var key in windowLoadEventUtil.events){
                    var tmpFunc = windowLoadEventUtil.events[key];
                    tmpFunc();
                }
            };
            windowLoadEventUtil.init = true;
        }
    };
    /**
     * 地理定位对象，提供地理坐标获取，获取坐标对应城市信息接口
     * @type {Object}
     */
    var geoLocationUtil = {
        /**
         * 获取用户位置信息
         * @param  {[type]} successCallback [description]
         * @param  {[type]} failCallback    [description]
         * @return {[type]}                 [description]
         */
        timeOutTime: 5000,
        getCurrentPosition: function (successCallback, failCallback) {
            if (window.navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true,
                    timeout: geoLocationUtil.timeOutTime,
                    maximumAge: 30000
                };
                window.navigator.geolocation.getCurrentPosition(successCallback, failCallback, options);
            } else {
                console.log("浏览器不支持html5来获取地理位置信息");
                failCallback();//执行失败回调
            }
        },
        /**
         * 根据用户经纬度坐标获取用户所在城市信息
         * @param  {[object]} $http [angular异步请求对象]
         * @param  {[float]} lon [经度]
         * @param  {[float]} lat [纬度]
         * @return {[object]} [城市信息]
         */
        getCurrentPositionCity: function ($http, lon, lat, successCallback, failCallback) {
            var coordsInfo = lat + "," + lon;
            // url出于域名检查，故此处暂作修改b-ai-d-u 修改为bidu
            var requestUrl = "//api.map.bidu.com/geocoder/v2/?ak=IhcNRiIMm1cE12Dviss4EXuz&callback=JSON_CALLBACK&location=" + coordsInfo + "&output=json&pois=tel";
            $http.jsonp(requestUrl).success(
                function(data, status, header, config){
                    if(data.status == "0") {
                        successCallback(data.result);
                    } else {
                        failCallback(data);
                    }
                }
            ).error(
                function(data){
                    failCallback(data);
                }
            );
        }
    };
    /**
     * 页面符层
     * @type {Object}
     */
    var overlayLayer = {
        // 判断是否位于‘iphone’下的
        judgeInBiduBoxIphone: function() {
            
        },
        // 显示“加载中”符层
        displayLoadingLayer: function(isVisible, text) {
            if(isVisible) return; // 此处判断如果位于Iphone下的手百要屏蔽自身‘加载中’
            overlayLayer.closeAllLayers();
            text = (text) ? text : '正在加载...';
            var loadingLayer = '<div class="loading-inner">' +
                    '<img class="loading-gif" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMDZhNzZmOC0zMjdjLTQ0YTctOWZmNC03ZmE4YTk4OGIwNDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDcxQUUxNDYyM0VCMTFFNkJDQzNCMUY3MTYxOTI3MEEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDcxQUUxNDUyM0VCMTFFNkJDQzNCMUY3MTYxOTI3MEEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MmE3YTExMS1mMjE4LTQyNjYtOWNlOS1iMjc1MGZmMDRiMWMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0N2E2ODNhZi02NDc4LTExNzktOTkxNi05NjdkNzc4YjQxMjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4I4uQIAAAD4klEQVR42syZX2jNYRjHf+c4+2eWjCmz3RCbsgtaohFFQkTiglAkJaJc2I0LLiZFaFdcCCklJcIKJWGkyPzbrsY2ttZWm/3F/vx+vo++7zy9fptzzs7Zb099drY65/19z/M+7/O8z7OQ53lOHBYGxWAFX+eCWWASaAfnwTPQAzpAK/gOYn5YKEaBuWA/2A7y5fOKsHpfG9hjnkF+gq+gFvyI9oGRKN83FRwDu0E6H6jNG2Zd/b4MUEBv14FP4FciPLgZlINs5Q3tmUFQz4eJgG5wBrwGmfRsyOezfeAtaIhXoHjhNNhrPUDoArfBLfCcooZbQ7w/E+SBVJ+1avllvFgEynZcAWt9hJ0FF0BnjPGeAmaDQpBm7UITqAQD0QicAK6BdZa4h+AAaHZGZ+k8+XnW+o3gKXDtdGHbSbCGLvf4gRNgSwLEOTzNEhbvLYGSFRb9z4ObwCXrBB6mR5NhsuVLLKHixS9+HpwCTinPCWVJFOfwgFRZAhczDP4ReJSpxKW4BzwQybaP4JsSKAd0oS1Q0sAO5Tk5oUfiKU1x2kvQr0QWsGwOCdzJnGW8V56gAxGtSen7oASKlnlGYJjVwlXeu+yMvdUwDxqRUhJDIm4+LwFme+/EkYQTYbLFn1VpzAI58keJ8p68VjjBWZ26GclrXoQeNN6Twv8qQIHNVgmcHuZF03hQbiW9AQrsZ703HsyWX3LU9tY7wVuXOryZEWZtU6A7x4FAnQ/TIyr+nDFMzCPeUVV+/pNmuulB12TvgC1DbfGA/GhRMThjHAicrAT2hnmjMKc4n98gKEthi2BisD3M7spscUjfJAKwPNZh48GWMBOzp0SuDFBgoRInNMiPavYDRuRqtotjbamsauYUSz5sClPUPRWHE8HWAAQW89mmikjoeSbf3GDjbbZ5F4N1rCyTcx6ztR575aGE2Mom3HhR8mGpz4gjWbaR2cOc3ipT1XRPcpGTKePFZWwDkm0ljD3jPWlLH/s1TR0cdeiubh8b+GSZpLT11vymQt+o7Mb9kdpqc4Eo5bgt0dstMbeNkwxzct+Ad9GMPsroek/FpQwkzzEMRmNZzBJF1k2+mj34YDTDI7mCHWcT7VkN1XVwP5YhJE0GRks5VkmzxEnDdJVXrZjGb4cYI65VbUToE06kavwWVmvMAQuY5zLUGmbNSobVYLwDTCl9B5mrXB+xfRyfNdGrLquC3NSnMbZcn8/KNe8m425UE1aHIxFp7lepROrGiXj7Bbg7wuAzZoHGxCMbwHIOm2IR2s4Rh4RGW9TX6zj/DWE6/yJ2hbm8aJrg76GgRufvwLzOHk5GY78FGADUS00Yx6G9xQAAAABJRU5ErkJggg==">' +
                    '<div class="loading-text">' + text + '</div>' +
                '</div>';

            var outterElement = document.createElement('div');
            outterElement.className = "loading-outter";
            outterElement.innerHTML = loadingLayer;

            if(document.getElementsByClassName("loading-outter").length === 1) {
                document.getElementsByClassName("loading-outter")[0].style.display = "-webkit-box";
            } else {
                document.body.appendChild(outterElement);
            }
        },
        // 显示“totast提示(icon, msg形式)”符层
        displayTotastLayer: function(msg, time, iconFlag, timeoutCallback) {
            overlayLayer.closeAllLayers();
            iconFlag = (typeof iconFlag == "boolean") ? iconFlag : false;
            timeoutCallback = (timeoutCallback != undefined && typeof timeoutCallback == "function") ? timeoutCallback : function(){};
            var totastImgVisible = (iconFlag) ? "display: block;" : "display: none;";
            console.log(totastImgVisible);
            var imgHtml = '<img class="totast-gif" style="' + totastImgVisible + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMDZhNzZmOC0zMjdjLTQ0YTctOWZmNC03ZmE4YTk4OGIwNDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDcxQUUxNDYyM0VCMTFFNkJDQzNCMUY3MTYxOTI3MEEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDcxQUUxNDUyM0VCMTFFNkJDQzNCMUY3MTYxOTI3MEEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MmE3YTExMS1mMjE4LTQyNjYtOWNlOS1iMjc1MGZmMDRiMWMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0N2E2ODNhZi02NDc4LTExNzktOTkxNi05NjdkNzc4YjQxMjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4I4uQIAAAD4klEQVR42syZX2jNYRjHf+c4+2eWjCmz3RCbsgtaohFFQkTiglAkJaJc2I0LLiZFaFdcCCklJcIKJWGkyPzbrsY2ttZWm/3F/vx+vo++7zy9fptzzs7Zb099drY65/19z/M+7/O8z7OQ53lOHBYGxWAFX+eCWWASaAfnwTPQAzpAK/gOYn5YKEaBuWA/2A7y5fOKsHpfG9hjnkF+gq+gFvyI9oGRKN83FRwDu0E6H6jNG2Zd/b4MUEBv14FP4FciPLgZlINs5Q3tmUFQz4eJgG5wBrwGmfRsyOezfeAtaIhXoHjhNNhrPUDoArfBLfCcooZbQ7w/E+SBVJ+1avllvFgEynZcAWt9hJ0FF0BnjPGeAmaDQpBm7UITqAQD0QicAK6BdZa4h+AAaHZGZ+k8+XnW+o3gKXDtdGHbSbCGLvf4gRNgSwLEOTzNEhbvLYGSFRb9z4ObwCXrBB6mR5NhsuVLLKHixS9+HpwCTinPCWVJFOfwgFRZAhczDP4ReJSpxKW4BzwQybaP4JsSKAd0oS1Q0sAO5Tk5oUfiKU1x2kvQr0QWsGwOCdzJnGW8V56gAxGtSen7oASKlnlGYJjVwlXeu+yMvdUwDxqRUhJDIm4+LwFme+/EkYQTYbLFn1VpzAI58keJ8p68VjjBWZ26GclrXoQeNN6Twv8qQIHNVgmcHuZF03hQbiW9AQrsZ703HsyWX3LU9tY7wVuXOryZEWZtU6A7x4FAnQ/TIyr+nDFMzCPeUVV+/pNmuulB12TvgC1DbfGA/GhRMThjHAicrAT2hnmjMKc4n98gKEthi2BisD3M7spscUjfJAKwPNZh48GWMBOzp0SuDFBgoRInNMiPavYDRuRqtotjbamsauYUSz5sClPUPRWHE8HWAAQW89mmikjoeSbf3GDjbbZ5F4N1rCyTcx6ztR575aGE2Mom3HhR8mGpz4gjWbaR2cOc3ipT1XRPcpGTKePFZWwDkm0ljD3jPWlLH/s1TR0cdeiubh8b+GSZpLT11vymQt+o7Mb9kdpqc4Eo5bgt0dstMbeNkwxzct+Ad9GMPsroek/FpQwkzzEMRmNZzBJF1k2+mj34YDTDI7mCHWcT7VkN1XVwP5YhJE0GRks5VkmzxEnDdJVXrZjGb4cYI65VbUToE06kavwWVmvMAQuY5zLUGmbNSobVYLwDTCl9B5mrXB+xfRyfNdGrLquC3NSnMbZcn8/KNe8m425UE1aHIxFp7lepROrGiXj7Bbg7wuAzZoHGxCMbwHIOm2IR2s4Rh4RGW9TX6zj/DWE6/yJ2hbm8aJrg76GgRufvwLzOHk5GY78FGADUS00Yx6G9xQAAAABJRU5ErkJggg==">';
            var totastLayer = '<div class="totast-inner" unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;">' +
                     imgHtml +
                    '<div class="totast-text">' + msg + '</div>' +
                '</div>';
            var outterElement = document.createElement('div');
            outterElement.className = "totast-outter";
            outterElement.innerHTML = totastLayer;
            if(document.getElementsByClassName("totast-outter").length === 1) {
                document.getElementsByClassName("totast-gif")[0].style.display = (iconFlag) ? "block" : "none";
                document.getElementsByClassName("totast-text")[0].innerHTML = msg;
                document.getElementsByClassName("totast-outter")[0].style.display = "-webkit-box";
            } else {
                document.body.appendChild(outterElement);
            }
            setTimeout(function(){
                overlayLayer.closeTotastLayer();
                timeoutCallback();
            }, time);
        },
        // 显示提示符层2
        displayTotastLayer2: function(msg, btnText, clickCallback) {
            overlayLayer.closeAllLayers();
            clickCallback = (clickCallback != undefined && typeof clickCallback == "function") ? clickCallback : function(){};
            document.body.style.overflow = "hidden";
            var totast2Layer = '<div class="totast2-inner" unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;">' +
                '<div class="totast2-text">' + msg + '</div>' +
                '<div class="totast2-btn">' + btnText + '</div>' +
            '</div>';
            var outterElement = document.createElement('div');
            outterElement.className = "totast2-outter";
            outterElement.innerHTML = totast2Layer;
            if(document.getElementsByClassName("totast2-outter").length === 1) {
                document.getElementsByClassName("totast2-text")[0].innerHTML = msg;
                document.getElementsByClassName("totast2-btn")[0].innerHTML = btnText;
                document.getElementsByClassName("totast2-outter")[0].style.display = "-webkit-box";
            } else {
                document.body.appendChild(outterElement);
            }
            // 对“我知道了”执行事件绑定
            document.getElementsByClassName('totast2-btn')[0].onclick = function() {
                overlayLayer.closeTotastLayer2();
                document.body.style.overflow = "";
                clickCallback();
            };
        },
        // 显示提示符层3
        displayTotastLayer3: function(msg, titleName, confirmText, cancelText, confirmCallback, cancelCallback, options) {
            overlayLayer.closeAllLayers();
            options = (typeof options === 'object') ? options : {};
            var _options = {
                'confirmColor': '#222222',
                'cancleColor': '#222222'
            };
            _options.confirmColor = (typeof options.confirmColor === "string") ? options.confirmColor : _options.confirmColor;
            _options.cancleColor = (typeof options.cancleColor === "string") ? options.cancleColor : _options.cancleColor;
            document.body.style.overflow = "hidden";
            var totast3Layer = '<div class="totast3-inner" unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;">' +
                '<div class="totast3-title">' + titleName + '</div>' +
                '<div class="totast3-text">' + msg + '</div>' +
                '<div class="totast3-bottom-outter">' +
                    '<div class="totast3-confirm" style="color: ' + _options.confirmColor + '">' + confirmText + '</div>' +
                    '<div class="totast3-cancle" style="color: ' + _options.cancleColor + '">' + cancelText + '</div>' +
                '</div>' +
            '</div>';
            var outterElement = document.createElement('div');
            outterElement.className = "totast3-outter";
            outterElement.innerHTML = totast3Layer;
            if(document.getElementsByClassName("totast3-outter").length === 1) {
                document.getElementsByClassName("totast3-text")[0].innerHTML = msg;
                document.getElementsByClassName("totast3-outter")[0].style.display = "-webkit-box";
            } else {
                document.body.appendChild(outterElement);
            }
            
            // 对“确定”执行事件绑定 
            document.getElementsByClassName('totast3-confirm')[0].onclick = function() {
                document.getElementsByClassName('totast3-outter')[0].style.display = 'none';
                document.body.style.overflow = "";
                confirmCallback();
            };
            // 对“取消”执行事件绑定
            document.getElementsByClassName('totast3-cancle')[0].onclick = function() {
                document.getElementsByClassName('totast3-outter')[0].style.display = 'none';
                document.body.style.overflow = "";
                cancelCallback();
            };
        },
        // 关闭“加载中”符层
        closeLoadingLayer: function() {
            if(document.getElementsByClassName("loading-outter").length === 1) {
                document.getElementsByClassName("loading-outter")[0].style.display = "none";
            }
        },
        // 关闭“符层”符层
        closeTotastLayer: function() {
            if(document.getElementsByClassName("totast-outter").length === 1) {
                document.getElementsByClassName("totast-outter")[0].style.display = "none";
            }
        },
        // 关闭“符层”符层
        closeTotastLayer2: function() {
            if(document.getElementsByClassName("totast2-outter").length === 1) {
                document.getElementsByClassName("totast2-outter")[0].style.display = "none";
            }
        },
        // 关闭“符层”符层
        closeTotastLayer3: function() {
            if(document.getElementsByClassName("totast3-outter").length === 1) {
                document.getElementsByClassName("totast3-outter")[0].style.display = "none";
            }
        },
        closeAllLayers: function() {
            overlayLayer.closeLoadingLayer();
            overlayLayer.closeTotastLayer();
            overlayLayer.closeTotastLayer2();
            overlayLayer.closeTotastLayer3();
        }
    };

    /**
     * 基本操作方法
     * @type {Object}
     */
    var toolUtil = {
        /***************************************************/
        /*****************字符串空格方法********************/
        /***************************************************/
        /**
         * 去除首尾空格
         * @param  {string} str 需要处理的字符串
         * @return {string}     值
         */
        trimBoth: function (str) {
            if(!str) return '';
            return str.trim();
        },
        // 去除左侧空格
        trimLeft: function (str) {
            if(!str) return '';
            return str.replace(/^\s*/g, '');
        },
        // 去除左侧空格
        trimRight: function (str) {
            if(!str) return '';
            return str.replace(/\s*$/g, '');
        },
        // 去除所有空格
        trimAll: function (str) {
            if(!str) return '';
            return str.replace(/\s*/g, '');
        },

        /***************************************************/
        /****************字符串危险字符过滤*****************/
        /***************************************************/
        filterStr: function(str) {
            str = str + "";
            str = str.replace(/\;/g,"");
            str = str.replace(/\&/g,"&amp;");
            str = str.replace(/\</g,"&lt;");
            str = str.replace(/\>/g,"&gt;");
            str = str.replace(/\'/g,"");
            str = str.replace(/\-\-/g," ");
            str = str.replace(/\//g,"");
            str = str.replace(/\%/g,"");
            return str;
        },
        /**
         * 对手机号, 卡号之类的信息进行简单加密
         * @param str
         * @returns {*}
         */
        encode: function (str) {
            return str;
        },
        /**
         * 对应的解密
         * @param str
         * @returns {*}
         */
        decode: function (str) {
            return str;
        },
        /**
         * 获取跟当前相关的日期和时间, 及还款日（默认）
         * @returns {Object}
         */
        getNow: function() {
            var date = new Date();
            var day = date.getDate();
            
            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                date: day,
                day: date.getDay(),
                hour: date.getHours(),
                min: date.getMinutes(),
                remindDate: day > 28 ? 28 : day
            }
        },
        /**
         * 获取 iosSelect 下拉框的选项
         * @returns {Array}
         */
        getSelectOptions: function () {
            var options = [];
            for (var i = 1; i < 29; i++) {
                var tmp = (i < 10 ? '0' + i : i);
                options.push({
                    id: tmp,
                    value: "每月" + tmp + "日"
                });
            }
            return options;
        },

        /**
         * 获取光标位置
         * @param  {Node} ctrl   // 节点
         * @return {Number}      // 光标位置
         */
        getCursorPosition: function(ctrl) {
            if (document.selection) { // IE
                var Sel = document.selection.createRange();
                Sel.moveStart('character', -ctrl.value.length);
                return Sel.text.length;
            } else {
                if (ctrl.selectionStart || ctrl.selectionStart == '0') {
                    return ctrl.selectionStart;
                }
            }
        },
        /**
         * 设置光标位置
         * @param {Node} elem   // 节点
         */
        setCursorPosition: function(elem, caretPos) {
            if (elem !== null) {
                if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    if(elem.selectionStart) {
                        elem.selectionStart = caretPos;
                        elem.selectionEnd = caretPos;
                    // if (elem.setSelectionRange) {
                    //     elem.focus();
                    //     elem.setSelectionRange(caretPos, caretPos);
                    } else
                        elem.focus();
                }
            }
        },
        isDev: function () {
            var host = window.location.hostname;
            return host.match(/localhost/gi);
        }

    };
    
    
    win.cookieUtil = cookieUtil;
    win.orientationChange = orientationChange;
    win.bodyClickEventUtil = bodyClickEventUtil;
    win.windowLoadEventUtil = windowLoadEventUtil;
    win.geoLocationUtil = geoLocationUtil;
    win.overlayLayer = overlayLayer;
    win.toolUtil = toolUtil;
})(window);