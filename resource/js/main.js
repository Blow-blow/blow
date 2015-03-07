$(function() {

	Jser.ACTION = "http://www.360youtu.com/blow_test/";
	var locOpenid = "";
	var role = "me";
	if (location.href.indexOf("openid") != -1) {
		//分享链接
		var reg = /openid=(\w+)/;
		locOpenid = location.href.match(reg)[1];
	} else {
		//原始链接
	}
	Jser.user = {};
	// 获取当前用户信息
	function init() {
		Jser.getJSON(Jser.ACTION + "index/" + location.search, "", function(data) {
			// alert(JSON.stringify(data));
			if (data.status == "success") {
				Jser.user = data.message;
				$(".js-n1").html(data.message.nickname);
				$(".js-h2").html(data.message.total_height);
				loadwxconfig();
				initwrapper();
			}
		}, function() {

		})
	}
	init();
	// var ishelp
	// 初始化场景
	function initwrapper() {
		// 原始链接（不带openid）
		// 已玩过A君 点击进去 直达 结果页 
		// 未玩过B君 点击进去 直达 开始页

		// 分享链接 （带有A君的openid）
		// A君 点击进去 直达 结果页
		// 未帮助的B君 点击进去  直达 开始页（开始帮助）
		// 已帮助过的C君 在次点击进去  直达帮助最终界面
		loadcanplay();
		return false;
		if (locOpenid) {
			// 分享链接
			// 是否为帮助好友玩me是自己，others是他人
			var url = Jser.ACTION + "help_or_not/?openid=" + locOpenid;
			Jser.getJSON(url, "", function(data) {
				if (data.message.help == "me") {
					// 自己玩
					role = "me";
				} else {
					// 别人玩
					role = "others";
					// 获取帮助者的信息
					// getUserInfo();
				}
				loadcanplay();
			}, function(data) {
				alert(JSON.stringify(data));
			});
		} else {
			role = "me";
			// 原始链接	
			loadcanplay();
		}
	};

	function getUserInfo() {
		var url = Jser.ACTION + "info/";
		if (locOpenid) {
			//分享链接
			url += "?openid=" + locOpenid;
		}
		Jser.getJSON(url, "", function(data) {
			alert(JSON.stringify(data));
			$(".js-n1").html(data.message.nickname);
			$(".js-h2").html(data.message.total_height);
		}, function(data) {
			alert(JSON.stringify(data));
		});
	}



	function loadcanplay() {
		var url = Jser.ACTION + "can_play/";
		if (locOpenid) {
			//分享链接
			url += "?openid=" + locOpenid;
		}
		alert(url)
		Jser.getJSON(url, "", function(data) {
			alert(JSON.stringify(data));
			var mesdata = data.message.data;
			if (mesdata == "played") {
				// 已经玩过 说明角色是自己		
				switch5();
			} else if (mesdata == "can help") {
				// 帮助页  说明角色是他人
				$(".js-other1").show();
			} else if (mesdata == "can’t help") {
				// 直达帮助最终界面 说明角色是他人
				switch6();
			} else if (mesdata == "can play") {
				// 开始界面 说明角色是自己
			}
		}, function(data) {
			alert(JSON.stringify(data));
		});
	}

	// 获取微信基本信息
	function loadwxconfig() {
		Jser.getJSON(Jser.ACTION + "wxconfig/", {
			"url": location.href
		}, function(data) {
			// alert(JSON.stringify(data))
			if (window.wx) {
				wx.config(data);
				// wx.config({
				// 	debug: false,
				// 	appId: data.appId,
				// 	timestamp: data.timestamp,
				// 	nonceStr: data.nonceStr,
				// 	signature: data.signature,
				// 	jsApiList: [
				// 		'onMenuShareTimeline',
				// 		'onMenuShareAppMessage'
				// 		// 'onMenuShareQQ',
				// 		// 'onMenuShareWeibo',
				// 		// 'getNetworkType'
				// 	]
				// });
				WeiXinShare.lineLink = global_lineLink + "?openid=" + Jser.user.openid;
				if (Jser.user.total_height) {
					WeiXinShare.shareTitle = "我在真朋友对屏吹活动中吹了" + Jser.user.total_height + "米，运足气，对屏吹！惊喜好礼等你拿！";
				}
				weixin6();
				wx.error(function(res) {
					Jser.getJSON(Jser.ACTION + "update_access_token/", '', function(data) {
						loadwxconfig();
					})
				});
			}
		}, function() {

		}, "post")
	};
	// 注册手机号
	function loadmobile() {
		var url = Jser.ACTION + "mobile/?mobile=" + $.trim($(".js-tel").val());
		// alert(url)
		Jser.getJSON(url, "", function(data) {
			// alert(JSON.stringify(data));
			$(".js-wrapper-tel").hide();
		}, function(data) {
			// alert(JSON.stringify(data));
			Jser.alert(data.reason);
		});
	};

	function doSure() {
		var v1 = $.trim($(".js-tel").val());
		var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
		if (reg.test(v1)) {
			loadmobile();
		} else {
			Jser.alert("请输入正确的电话号码");
		}

	};

	$(".js-start").click(switch1);

	$(".js-explain").click(showExplain);

	$(".js-wrapper-explain").click(hideExplain);

	$(".js-touch2").click(switch2);

	$(".js-help").click(function() {
		shareTitle($(".js-h1").text());
		Jser.share();
	});
	$(".js-help2").click(function() {
		// 累计
		shareTitle($(".js-help-h2").text());
		Jser.share();
	});

	$(".js-gameplay").click(function() {
		// $(".js-wrapper1").show();
		// $(".js-wrapper6").hide();
		// $(".js-wrapper6").fadeOut(300, function() {		
		// 	$(".js-wrapper1").fadeIn(300, function() {

		// 	});
		// });
		// 重新开始
		location.href = "/blow_test/public/";
	});

	function shareTitle(m) {
		WeiXinShare.lineLink = global_lineLink + "?openid=" + Jser.user.openid;
		WeiXinShare.shareTitle = "我在真朋友对屏吹活动中吹了" + m + "米，运足气，对屏吹！惊喜好礼等你拿！";
		weixin6bySet();
	}

	$(".js-sure").click(doSure);


	function switch1() {
		$(".js-wrapper1").fadeOut(300, function() {
			$(".js-wrapper2").fadeIn(300, function() {
				// $(".js-wrapper-tel").show();
			});
		});
		// $(".js-wrapper1").hide();
		// $(".js-wrapper2").show();
	}

	function showExplain() {
		$(".js-wrapper-explain").show();
	}

	function hideExplain() {
		$(".js-wrapper-explain").hide();
	}

	function switch2() {
		// $(".js-wrapper2").hide();
		// $(".js-wrapper3").show();
		$(".js-wrapper2").fadeOut(300, function() {
			initDraw();
			$(".js-wrapper3").fadeIn(300, function() {});
		});
	}

	function switch3() {
		// $(".js-wrapper3").hide();
		// $(".js-wrapper4").show();
		loadadd_height();
		$(".js-wrapper3").fadeOut(300, function() {
			$(".js-wrapper4").fadeIn(300, function() {

			});
		});
	};

	function switch5() {
		$(".js-wrapper1").hide();
		$(".js-wrapper5").show();

	}

	function switch6() {
		$(".js-wrapper1").hide();
		$(".js-wrapper6").show();

	}


	//为openid为x的用户吹气
	function loadadd_height() {
		var url = Jser.ACTION + "add_height/?openid=" + Jser.user.openid;
		// Jser.alert(url);
		Jser.getJSON(url, "", function(data) {
			// alert(JSON.stringify(data));
			$(".js-h1").html(data.message.height);
			$(".js-h2").html(data.message.total_height);
			shareTitle(data.message.height);
			setTimeout(function() {
				$(".js-wrapper-tel").show();
			}, 200)
		}, function(data) {
			// alert(JSON.stringify(data));
			Jser.alert(data.reason);
		});
	}
	var tanhao = false;
	var initTanhao = false;
	var processValue = 0; //开始进度
	var processSpeed = 20; //速度控制
	var canvas = document.getElementById("canvas-process");
	var context = canvas.getContext('2d');

	function initDraw() {
		$("#hand-message").text("准备开始");
		initTanhao = true;
		tanhao = true;
		skipstart = false;
		drawProcess();
		processValue = 0;
		handi = 0;
		clearInterval(handTime);
	}
	var imgload = false;
	if (document.getElementById('imgprocess').complete) {
		imgload = true;
		// initDraw();
	}
	document.getElementById('imgprocess').onload = function() {
		imgload = true;
		// initDraw();
	};

	// 倒计时
	function drawProcess() {
		if (!imgload) {
			return;
		}
		if (processValue > 500) {
			// clearTimeout(processTime); //加载完成后
			return;
		}
		var process = processValue;
		context.clearRect(0, 0, 86, 86);
		context.globalAlpha = 1;
		//加载灰色进度条图片
		var img = document.getElementById("imgprocess");
		context.drawImage(img, 0, 0);
		context.globalCompositeOperation = "destination-out";
		// console.log(processValue);
		//加载进度
		context.beginPath();
		context.moveTo(86, 86);
		context.arc(86, 86, 192, Math.PI * 1.5, Math.PI * 1.5 + Math.PI * 2 * process / 500, false);
		context.closePath();
		context.fillStyle = "#ccc";
		context.globalAlpha = 1;
		context.fill();

		context.globalCompositeOperation = "source-over";

		//输出数字
		context.font = "bold 2.2rem Arial";
		context.fillStyle = '#fff';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.moveTo(86, 86);
		context.globalAlpha = 1;
		if (initTanhao) {
			context.fillText("10S", 86, 86);
		} else {
			if (tanhao) {
				context.font = "bold 4rem Arial";
				context.fillText("!", 86, 86);
			} else {
				context.fillText(Math.abs(parseInt((processSpeed * processValue) / 1000) - 10) + "S", 86, 86);
			}
		}
		context.font = "normal 1rem Arial";
		// context.fillText("sec", 86, 150);
		processValue += 1;
	}


	var handTime = null;
	var handi = 0;

	var skipstart = false;
	var thisstaus = 0; // 按键的状态
	$("#canvas-btn").on("touchstart", function(event) {
		event.stopPropagation();
		event.preventDefault();
		thisstaus = 1;
		initTanhao = false;
		$("#hand-message").text("准备开始");
		processValue = 0;
		var $this = $(this);
		if (skipstart == false) {
			handi = 0;
		} else {
			handi = 50;
		}
		clearInterval(handTime);
		handTime = setInterval(function() {
			handi++;
			if (handi > 50 && handi <= 550) {
				skipstart = true;
				tanhao = false;
				drawProcess();
				$("#hand-message").text("按住按钮，持续吹气");
				doAni();

			}
			if (handi > 550) {
				tanhao = false;
				$("#hand-message").text("完成");
				stopAni();
				// $("#canvas-btn").hide();
				clearInterval(handTime);
				handi = 0;
				processOpen();
			}
		}, 20)
		$("#canvas-btn").on("touchend", function(e) {
			if (thisstaus != 1) {
				return;
			}
			$("#hand-message").text("按钮已松开，请重新吹气");
			stopAni();
			tanhao = true;
			processValue = 0;
			drawProcess();
			handi = 0;
			clearInterval(handTime);
			handTime = null;
		})
	});



	function processOpen() {
		//成功
		switch3();
	}

	var iTime = null,
		aniindex = 0,
		aniback = true;

	function ani() {
		var $ani = $(".js-ani");
		var _offset = {};
		// var left=
		if (!iTime) {
			iTime = setInterval(function() {
				if (aniback) {
					aniindex++;
				} else {
					aniindex--;
				}
				if (aniindex == 4) {
					aniback = false;
				} else if (aniindex == 0) {
					aniback = true;
				}
				$ani.css('backgroundPositionY', -92 * aniindex + 'px');
				_offset = $ani.offset();
				$ani.css('top', _offset.top - Math.random() * 3 + 'px');
			}, 70);
		}
	}

	function doAni() {
		ani();
	}

	function stopAni() {
		$(".js-ani").css('top', "55%");
		clearInterval(iTime);
		iTime = null;
	}



})