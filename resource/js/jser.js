/**
 * Jser - web app helper functions
 */
(function(win) {
	var doc = document;
	var noop = function() {};
	win.Jser = win.Jser || {};
	Jser.ua = navigator.userAgent;
	Jser.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');

	// 初始化控制台，防止控制台报错
	(function() {
		var method;
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = (win.console = win.console || {});

		while (length--) {
			method = methods[length];

			// 检测控制台不存在的方法
			if (!console[method]) {
				console[method] = noop;
			}
		}
	}());
	// 初始化HTML5方法
	(function() {
		var method;
		var methods = [
			'localStorage'
		];
		var length = methods.length;
		while (length--) {
			method = methods[length];
			if (!win[method]) {
				win[method] = noop;
			}
		}
	}());
	// 浏览器检测
	(function(a) {
		function b(a) {
			var os = this.os = {},
				browser = this.browser = {},
				WebKit = a.match(/WebKit\/([\d.]+)/),
				android = a.match(/(Android)[\s+|\/]([\d.]+)/),
				windowPhone = a.match(/Windows\s+Phone/),
				ipad = a.match(/(iPad).*OS\s([\d_]+)/),
				iphone = !ipad && a.match(/(iPhone\sOS)\s([\d_]+)/),
				webOS = a.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				touchPad = webOS && a.match(/TouchPad/),
				Kindle = a.match(/Kindle\/([\d.]+)/),
				Silk = a.match(/Silk\/([\d._]+)/),
				BlackBerry = a.match(/(BlackBerry).*Version\/([\d.]+)/),
				BB10 = a.match(/(BB10).*Version\/([\d.]+)/),
				RIM = a.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				PlayBook = a.match(/PlayBook/),
				Chrome = a.match(/Chrome\/([\d.]+)/) || a.match(/CriOS\/([\d.]+)/),
				Firefox = a.match(/Firefox\/([\d.]+)/),
				PC = a.match(/Windows|Linux|Macintosh/);
			if (browser.webkit = !!WebKit) browser.version = WebKit[1];
			android && (os.android = !0, os.version = android[2]),
				iphone && (os.ios = os.iphone = !0, os.version = iphone[2].replace(/_/g, ".")),
				ipad && (os.ios = os.ipad = !0, os.version = ipad[2].replace(/_/g, ".")),
				webOS && (os.webos = !0, os.version = webOS[2]),
				touchPad && (os.touchpad = !0),
				BlackBerry && (os.blackberry = !0, os.version = BlackBerry[2]),
				BB10 && (os.bb10 = !0, os.version = BB10[2]),
				RIM && (os.rimtabletos = !0, os.version = RIM[2]),
				PlayBook && (browser.playbook = !0),
				Kindle && (os.kindle = !0, os.version = Kindle[1]),
				Silk && (browser.silk = !0, browser.version = Silk[1]), !Silk && os.android && a.match(/Kindle Fire/) && (browser.silk = !0),
				Chrome && (browser.chrome = !0, browser.version = Chrome[1]),
				Firefox && (browser.firefox = !0, browser.version = Firefox[1]),
				os.tablet = !!(ipad || PlayBook || android && !a.match(/Mobile/) || Firefox && a.match(/Tablet/)),
				os.phone = !os.tablet && !!(android || iphone || windowPhone || webOS || BlackBerry || BB10 || Chrome && a.match(/Android/) || Chrome && a.match(/CriOS\/([\d.]+)/) || Firefox && a.match(/Mobile/)),
				os.pc = !os.tablet && !os.phone && !!PC;
		}
		var u = Jser.ua;
		b.call(a, u), a.__detect = b;
		a.os.touch = !!(('ontouchstart' in win) && win.DocumentTouch && doc instanceof DocumentTouch);
	})(Jser);

	// 是否开启debug模式
	Jser.debug = false;
	if (location.hash.indexOf("debug")) {
		Jser.debug = true;
	}

	// 空函数
	Jser.noop = noop;

	Jser._guid = 1;
	/**
	获取唯一GUID
	* @return {Number} 返回唯一GUID	
	*/
	Jser.getGUID = function() {
		return Jser._guid++;
	};
	/**
	错误图片
	* @param {String or Element} [ssrc] [错误图片路径]	
	*/
	Jser._errorImg = "";
	Jser.setErrorImg = function(ssrc) {
		Jser._errorImg = ssrc;
	};
	/**
	懒加载图片
	* @param {String or Element} [el] [选择器]
	* @return {Number} 返回唯一GUID	
	*/
	Jser.loadimages = function(el) {
		el = el || "body";
		var lazy = $(el).find("[data-src]");
		lazy.each(function(i) {
			loadImg.call(this);
		});

		function loadImg() {
			var t = this;
			var dataSrc = t.getAttribute("data-src");
			var img = new Image();
			img.src = dataSrc;
			img.onload = function() {
				t.setAttribute("src", dataSrc);
				$(t).removeAttr("data-src");
			}
			img.onerror = function() {
				Jser._errorImg && t.setAttribute("src", Jser._errorImg)
			}
		}
	};
	/**
	加密手机号
	* @param  {[String]} name [手机号]
	* @return {[String]} 返回被加密的手机号
	*/
	Jser.uname = function(name) {
		if (name) {
			name = name.substring(0, 3) + "****" + name.substring(8, 11);
		} else {
			name = "匿名";
		}
		return name;
	};
	/**
	 * 设置离线缓存
	 * @param {[String]} key  [键]
	 * @param {[String]} name [值]
	 */
	Jser.setItem = function(key, name) {
		localStorage.setItem(key, name);
	};
	/**
	 * 获取离线缓存
	 * @param  {[String]} key [键]
	 * @return {[String]}     [值]
	 */
	Jser.getItem = function(key) {
		return localStorage.getItem(key) || "";
	};
	/**
	 * 打印log
	 * @param  {[String]} str [日志]
	 */
	Jser.log = function(str) {
		Jser.debug && console.log(str);
	};
	/**
	 * [扩展jQuery ajax方法]
	 * @param  {[String]} url      [地址]
	 * @param  {[String,Object]} data     [参数]
	 * @param  {[Function]} sfn      [成功返回函数]
	 * @param  {[Function]} errfn    [失败返回函数]
	 * @param  {[String]} method   [请求类型get 或者post]
	 * @param  {[String]} datatype [数据类型json或者jsonp]
	 * @param  {[Boolen]} isload   [是否显示加载进度条]
	 */
	Jser.getJSON = function(url, data, sfn, errfn, method, datatype, isload) {
		var t = this;
		data = data || "";
		isload && $("#js-loading").show();
		// 关闭全局AJAX缓存
		// $.ajaxSetup({
		// 	cache: false 
		// });
		$("body").queue(function() {
			$.ajax({
				type: method || "get",
				dataType: datatype || 'json',
				contentType: 'application/x-www-form-urlencoded;charset=utf-8',
				url: url,
				cache: false,
				data: data,
				error: function(e, xhr, opt) {
					$("#js-loading").hide();
					$("body").dequeue();
					if (xhr == "abort") {
						Jser.log("------------------------error↓--------------------------");
						Jser.log("error:abort" + ",参数：" + data + ",地址:" + url);
						Jser.log("错误行为分析：")
						Jser.log("说明你的请求并没有返回值,或者返回值超时")
						Jser.log("1.检测是否断网了")
						Jser.log("2.检测当前参数" + data + "是否正确")
						Jser.log("3.是否清理缓存,ctrl+F5 强制清理缓存.")
						Jser.log("------------------------error↑------------------------");
						return;
					} else {
						e.url = url;
						e.data = data;
						Jser.log("------------------------error↓--------------------------");
						Jser.log("error:" + "参数：" + data + ",地址:" + url + "状态: " + e.status + " " + e.statusText);
						Jser.log("错误行为分析：")
						Jser.log("说明你的请求并没有返回值,或者返回值超时")
						Jser.log("1.检测是否断网了")
						Jser.log("2.检测当前参数" + data + "是否正确")
						Jser.log("3.是否清理缓存,ctrl+F5 强制清理缓存.")
						Jser.log("------------------------error↑------------------------");
						errfn && errfn(e);
					}
				},
				success: function(j) {
					$("#js-loading").hide();
					$("body").dequeue();
					var flag = false;
					if (!j) {
						Jser.log("error:ajax没有返回数据");
						Jser.alert("与服务器链接失败，请重试");
						errfn && errfn();
						return false;
					}
					// sfn && sfn(j);
					var c = j.status;
					if (c == "success" || j.appId) {
						flag = true;
					} else {
						if (j.reason == "need login") {
							if (location.hash.indexOf("debug") == -1) {
								var _url = "/blow/login";
								if (locOpenid) {
									_url += "/?openid=" + locOpenid;
								}
								location.href = _url;
							}
							return false;
						}
						if (j.msg) {
							Jser.alert(j.msg);
						}
						Jser.log("------------------------error↓--------------------------");
						Jser.log("error:" + "参数：" + data + ",地址:" + url + ",code:" + j.code + ",message:" + j.msg);
						Jser.log("错误行为分析：")
						Jser.log("1.检测当前参数" + data + "是否正确")
						Jser.log("2.是否清理缓存,ctrl+F5 强制清理缓存.")
						Jser.log("------------------------error↑------------------------");
					}
					if (flag) {
						Jser.log("------------------------success↓--------------------------");
						Jser.log("参数：" + data);
						Jser.log("地址:" + url);
						Jser.log("返回值:");
						Jser.log(j);
						Jser.log("------------------------success↑------------------------");
						sfn && sfn(j);
					} else {
						errfn && errfn(j);
					}
				}
			});
		});
	};
	/**	
	 * @return {[Number]} [获取滚动高度]
	 */
	Jser.getScrollTop = function() {
		return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
	};
	/**
	 * 弹出框 需要对应的HTML片段和CSS
	 * @param  {[String]}   txt      [文本]
	 * @param  {Function} callback [确定的回调函数]
	 * @return {[Number]}            [返回当前弹出框的UID]
	 */
	Jser.alert = function(txt, callback) {
		var $pop = $("#js-pop-tpl").clone();
		var uid = Jser.getGUID();
		$pop.find(".js-pop-txt").html(txt);
		$pop.find(".js-close").attr("data-uid", uid);
		$pop.attr("id", "js-pop" + uid);
		$("body").append($pop);
		$pop.show();
		$(".js-close").one('click', function() {
			var uid = $(this).data("uid");
			$("#js-pop" + uid).remove();
			$(doc).trigger("closepop" + uid);
			callback && callback();
		});
		return uid;
	};
	/**
	 * [选择弹出框 需要对应的HTML片段和CSS]
	 * @param  {[String]}   txt      [文本]
	 * @param  {[Function]}   ok       [确定的回调函数]
	 * @param  {[Function]}   cancel   [取消的回调函数]
	 * @param  {Function} callback [弹出的回调函数]
	 * @return {[Number]}            [返回当前弹出框的UID]
	 */
	Jser.confirm = function(txt, ok, cancel, callback) {
		var $pop = $("#js-pop-tpl").clone();
		var uid = Jser.getGUID();
		$pop.find(".js-pop-txt").html(txt);
		$pop.find(".js-close").attr("data-uid", uid).html("取消");
		var $clone = $pop.find(".js-close").clone();
		$clone.addClass("js-ok").html("好");
		$pop.find(".js-close").parent().append($clone);
		$pop.attr("id", "js-pop" + uid);
		$("body").append($pop);
		$pop.show();
		$pop.find(".js-close").one('click', function() {
			var uid = $(this).data("uid");
			$("#js-pop" + uid).remove();
			$(document).trigger("closepop" + uid);
			cancel && cancel();
		});
		$pop.find(".js-ok").one('click', function() {
			$(document).trigger("okpop" + uid);
			ok && ok();
		});
		callback && callback($pop);
		return uid;
	};
	// 显示分享
	Jser.share = function() {
		Jser.showShare();
	};
	Jser.showShare = function() {
		$("#js-weixin-share").show().on("touchstart.share", this.hideShare);
	};
	Jser.hideShare = function() {
		$("#js-weixin-share").hide().off("touchstart.share");
	};
	/**
	 * iOS启动动画 (示例)
	 */
	Jser.startupImage = function() {
		var portrait;
		var landscape;
		var pixelRatio;
		var head;
		var link1;
		var link2;

		pixelRatio = window.devicePixelRatio;
		head = document.getElementsByTagName('head')[0];

		if (navigator.platform === 'iPad') {
			portrait = pixelRatio >= 2 ? 'portrait-retina.png' : 'portrait.png';
			landscape = pixelRatio >= 2 ? 'landscape-retina.png' : 'landscape.png';

			link1 = document.createElement('link');
			link1.setAttribute('rel', 'apple-touch-startup-image');
			link1.setAttribute('media', 'screen and (orientation: portrait)');
			link1.setAttribute('href', portrait);
			head.appendChild(link1);

			link2 = document.createElement('link');
			link2.setAttribute('rel', 'apple-touch-startup-image');
			link2.setAttribute('media', 'screen and (orientation: landscape)');
			link2.setAttribute('href', landscape);
			head.appendChild(link2);
		} else {
			portrait = pixelRatio >= 2 ? "startup-retina.png" : "startup.png";
			portrait = screen.height >= 568 ? "startup-retina-4in.png" : portrait;
			link1 = document.createElement('link');
			link1.setAttribute('rel', 'apple-touch-startup-image');
			link1.setAttribute('href', portrait);
			head.appendChild(link1);
		}

		//hack to fix letterboxed full screen web apps on 4" iPhone / iPod with iOS 6
		if (navigator.platform.match(/iPhone|iPod/i) && (screen.height === 568) && navigator.userAgent.match(/\bOS 6_/)) {
			if (Jser.viewportmeta) {
				Jser.viewportmeta.content = Jser.viewportmeta.content
					.replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
					.replace(/\bwidth\s*=\s*device-width\b/, '');
			}
		}
	};

})(window)