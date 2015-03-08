// 分享带出来的id
var locOpenid = "";
$(function() {

	Jser.ACTION = "http://www.360youtu.com/blow_test/";

	// 角色
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
		// alert("locOpenid:" + locOpenid + "," + location.href);
		Jser.getJSON(Jser.ACTION + "index/" + location.search, "", function(data) {
			// alert(JSON.stringify(data));
			if (data.status == "success") {
				Jser.user = data.message;
				var h = data.message.total_height;
				$(".js-help-h2").html(h);
				$(".js-pc-h1").html(h);
				if (h > 700) {
					h = 700;
				}
				$(".js-help-pc").css("top", 200 - h * 0.375);
				loadwxconfig();
				initwrapper();
			}
		}, function() {

		}, "get", "json", true)
	};
	// 获取微信基本信息
	function loadwxconfig() {
		Jser.getJSON(Jser.ACTION + "wxconfig/", {
			"url": location.href
		}, function(data) {
			// alert(JSON.stringify(data))
			if (window.wx) {
				wx.config(data);
				weixin6();
				// alert(wx.error)
				wx.error(function(res) {
					Jser.getJSON(Jser.ACTION + "update_access_token/", '', function(data) {
						loadwxconfig();
					})
				});
			}
		}, function(data) {
			alert(JSON.stringify(data))
		}, "post", "json", true)
	};
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

		// 先判断
		if (locOpenid) {
			// 分享链接
			// 是否为帮助好友玩me是自己，others是他人
			var url = Jser.ACTION + "help_or_not/?openid=" + locOpenid;
			Jser.getJSON(url, "", function(data) {
				// alert(JSON.stringify(data));
				if (data.message.help == "me") {
					// 自己玩
					role = "me";
					locOpenid = "";
					shareTitle(Jser.user.total_height);
				} else {
					// 别人玩
					role = "others";
					// 获取帮助者的信息
				}
				loadcanplay();
			}, function(data) {
				// alert(JSON.stringify(data));
			}, "get", "json", true)
		} else {
			// 原始链接	
			role = "me";
			shareTitle(Jser.user.total_height);
			loadcanplay();
		}
	};
	// 分享链接 是否需要带
	function shareTitle(m) {
		WeiXinShare.lineLink = global_lineLink + "?openid=" + Jser.user.openid;
		if (m) {
			WeiXinShare.shareTitle = "我在真朋友对屏吹活动中吹了" + m + "米，运足气，对屏吹！惊喜好礼等你拿！";
		}
		weixin6bySet();
	};
	// 判断进入的场景 应该是那个
	function loadcanplay() {
		var url = Jser.ACTION + "can_play/";
		if (locOpenid) {
			//分享链接
			url += "?openid=" + locOpenid;
		}
		Jser.getJSON(url, "", function(data) {
			// alert(JSON.stringify(data));
			var mesdata = data.message.data;
			if (mesdata == "played") {
				// 已经玩过 说明角色是自己		
				switch5();
			} else if (mesdata == "can help") {
				// 显示帮助页  说明角色是他人
				if (role != "me") {
					get_height();
					switch1();
				}
			} else if (mesdata == "can't help") {
				// 已经帮助过了 那么就直接跳到帮助最终界面
				switch6();
			} else if (mesdata == "can play") {
				// 开始界面 说明角色是自己 
			}
		}, function(data) {
			// alert(JSON.stringify(data));
		}, "get", "json", true)
	};
	// 提现帮助者的时候到了
	function get_height() {
		var url = Jser.ACTION + "get_height/?openid=" + locOpenid;
		Jser.getJSON(url, "", function(data) {
			// alert(JSON.stringify(data));
			$(".js-other1").show();
			$(".js-n1").html(data.message.nickname);
			$(".js-n1-h2").html(data.message.height);
		});
	};
	// 帮助者的最终界面
	function get_small_help_big() {
		var url = Jser.ACTION + "get_small_help_big/?openid_big=" + locOpenid + "&openid_small=" + Jser.user.openid;
		Jser.getJSON(url, "", function(data) {
			var h = data.message.height;
			$(".js-other-h1").html(h);
			$(".js-pc-h1").html(h);
			$(".js-help-pc").css("top", 200 - h * 0.375);
			$(".js-other-h2").html(data.message.total_height);
		});
	};
	// 获取帮助者的帮助信息
	function get_help_message() {
		var url = Jser.ACTION + "get_help_message/?openid=" + (locOpenid || Jser.user.openid);
		Jser.getJSON(url, "", function(data) {
			var _html = "";
			$.each(data.message.help_message, function(i, item) {
				_html += item.nickname + "帮楼主吹了" + item.height + "米" + "<br\/>";
				$(".js-help-message1").html(item.nickname + "帮楼主吹了" + item.height + "米");
			})
			$(".js-help-message").html(_html);

		}, function(data) {
			// Jser.alert(data.reason);
		});
	};

	$(".js-start").click(switch1);

	$(".js-explain").click(function() {
		$(".js-wrapper-explain").show();
	});

	$(".js-wrapper-explain").click(function() {
		$(this).hide();
	});

	$(".js-touch2").on("touchstart", switch2);
	// 第一次登陆 分享
	$(".js-help").click(function() {
		Jser.share();
	});
	// 第二次登陆 分享
	$(".js-help2").click(function() {
		shareTitle($(".js-help-h2").text());
		Jser.share();
	});
	// 帮助别人之后 我也要拿大奖
	$(".js-gameplay").click(function() {
		// 重新开始
		location.href = "/blow_test/public/";
	});
	// 注册手机号
	$(".js-sure").click(function() {
		var v1 = $.trim($(".js-tel").val());
		var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
		if (reg.test(v1)) {
			var url = Jser.ACTION + "mobile/?mobile=" + $.trim($(".js-tel").val());
			Jser.getJSON(url, "", function(data) {
				$(".js-wrapper-tel").hide();
			}, function(data) {
				Jser.alert(data.reason);
			});
		} else {
			Jser.alert("请输入正确的电话号码");
		}
	});

	function switch1() {
		$(".js-wrapper1").fadeOut(300, function() {
			$(".js-wrapper2").fadeIn(300, function() {});
		});
	};

	function switch2() {
		$(".js-wrapper2").fadeOut(300, function() {
			initDraw();
			$(".js-wrapper3").fadeIn(300, function() {});
		});
	};

	function switch3() {
		loadadd_height();
		$(".js-wrapper3").fadeOut(300, function() {
			if (role == "me") {
				$(".js-wrapper4").fadeIn(300, function() {});
			} else {
				// 帮助者
				$(".js-wrapper6").fadeIn(300, function() {});
			}
		});
	};

	function switch5() {
		get_help_message();
		$(".js-wrapper1").fadeOut(300, function() {
			$(".js-wrapper5").fadeIn(300, function() {

			});
		});
	}

	function switch6() {
		get_small_help_big();
		get_help_message();
		$(".js-wrapper1").fadeOut(300, function() {
			$(".js-wrapper6").fadeIn(300, function() {

			});
		});
	};
	//为openid为x的用户吹气
	function loadadd_height() {
		if (role == "me") {
			var url = Jser.ACTION + "add_height/?openid=" + Jser.user.openid;
		} else {
			var url = Jser.ACTION + "add_height/?openid=" + locOpenid;
		}
		Jser.getJSON(url, "", function(data) {
			// alert(JSON.stringify(data));
			var h = data.message.height;
			$(".js-h1").html(h);
			$(".js-pc-h1").html(h);
			if (role == "me") {
				if (h > 600) {
					h = 600
				}
				$(".js-pc").css("top", 200 - h * 0.375);
				shareTitle(data.message.height);
				setTimeout(function() {
					$(".js-wrapper-tel").show();
				}, 3500);
			} else {
				$(".js-other-h2").html(data.message.total_height);
				$(".js-help-pc").css("top", 200 - h * 0.375);
				get_help_message();
			}
		}, function(data) {
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
		$(".js-random-txt").html(handi);
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
		var $random = $(".js-random-txt");
		// if (skipstart == false) {
		// 	handi = 0;
		// } else {
		// 	handi = 100;
		// }
		clearInterval(handTime);
		handTime = setInterval(function() {
			handi++;
			if (handi > 100 && handi <= 600) {
				skipstart = true;
				tanhao = false;
				drawProcess();
				$("#hand-message").text("按住按钮，持续吹气");
				doAni();
				$random.html(handi - 100);
			}
			if (handi > 600) {
				tanhao = false;
				$("#hand-message").text("完成");
				stopAni2();
				// $("#canvas-btn").hide();
				clearInterval(handTime);
				handi = 0;
				processOpen();
			}
		}, 20)
		$("#canvas-btn").on("touchend", function(e) {
			if (thisstaus != 1 || handi > 600) {
				return;
			}
			$("#hand-message").text("按钮已松开，请重新吹气");
			stopAni();
			tanhao = true;
			processValue = 0;
			drawProcess();
			handi = 0;
			$random.html(handi);
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
				$ani.css('top', _offset.top - Math.random() * 2 + 'px');
			}, 70);
		}
	}

	function doAni() {
		ani();
	}

	function stopAni() {
		$(".js-ani").css('top', "55%");
		stopAni2();
	}
	function stopAni2() {
		clearInterval(iTime);
		iTime = null;
	}



})