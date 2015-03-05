$(function() {



	$(".js-start").click(switch1);

	$(".js-explain").click(showExplain);

	$(".js-wrapper-explain").click(hideExplain);

	$(".js-touch2").click(switch2);

	$(".js-help").click(Jser.share);

	$(".js-sure").click(doSure);


	function switch1() {
		$(".js-wrapper1").fadeOut(300, function() {
			$(".js-wrapper2").fadeIn(300, function() {});
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
			$(".js-wrapper3").fadeIn(300, function() {
				initDraw();
			});
		});
	}

	function switch3() {
		// $(".js-wrapper3").hide();
		// $(".js-wrapper4").show();
		$(".js-wrapper3").fadeOut(300, function() {
			$(".js-wrapper4").fadeIn(300, function() {});
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
		initDraw();
	}
	document.getElementById('imgprocess').onload = function() {
		imgload = true;
		initDraw();
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
	$("#canvas-btn").on("touchstart", function() {
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
			}
			if (handi > 550) {
				tanhao = false;
				$("#hand-message").text("完成");
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


	function doSure() {
		var v1 = $.trim($(".js-tel").val());
		var reg = /^(\d{1,4}\-)?(13|15|17|18){1}\d{9}$/;
		if (reg.test(v1)) {
			$(".js-wrapper-tel").hide();
			// Jser.getJSON(ST.PATH.ACTION, v1, function(data) {
			// 	Jser.alert(data.msg);
			// }, function() {

			// }, "post");
		} else {
			Jser.alert("请输入正确的电话号码");
		}
		
	}


})