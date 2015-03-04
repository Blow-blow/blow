$(function() {



	$(".js-start").click(switch1);

	$(".js-explain").click(switch11);

	$(".js-wrapper11").click(hideSwitch11);

	$(".js-touch2").click(switch2);

	// $(".js-touch3").click(switch3);


	function switch1() {
		$(".js-wrapper1").hide();
		$(".js-wrapper2").show();
	}

	function switch11() {
		$(".js-wrapper1").hide();
		$(".js-wrapper11").show();
	}

	function hideSwitch11() {
		$(".js-wrapper1").show();
		$(".js-wrapper11").hide();
	}

	function switch2() {
		$(".js-wrapper2").hide();
		$(".js-wrapper3").show();
		initDraw();
	}

	function switch3() {
		$(".js-wrapper3").hide();
		$(".js-wrapper4").show();
		
	}


	//进度
	function TimeProcess() {
		if (!imgload) {
			return;
		}
		if (processValue > 400) {
			clearTimeout(processTime); //加载完成后
			return;
		}
		var text = processValue + "%";
		var process = processValue;
		context.clearRect(0, 0, 240, 240);
		context.globalAlpha = 1;
		//加载灰色进度条图片
		var img = document.getElementById("imgprocess");
		context.drawImage(img, 0, 0);
		context.globalCompositeOperation = "destination-out";

		//加载进度
		context.beginPath();
		context.moveTo(120, 120);
		context.arc(120, 120, 192, Math.PI * 1.5, Math.PI * 1.5 + Math.PI * 2 * process / 400, false);
		context.closePath();
		context.fillStyle = "#ccc";
		context.globalAlpha = 1;
		context.fill();

		context.globalCompositeOperation = "source-over";

		//输出数字
		context.font = "bold 4rem Arial";
		context.fillStyle = '#adaeb2';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.moveTo(120, 120);
		context.globalAlpha = 1;
		context.fillText(parseInt(processValue / 4), 120, 110);
		context.font = "normal 1rem Arial";
		context.fillText("%", 120, 150);
		processValue += 1;
	}
	var thisstaus = 0;
	var tanhao = false;
	// 倒计时
	function drawProcess() {
		if (!imgload) {
			return;
		}
		if (processValue > 400) {
			clearTimeout(processTime); //加载完成后
			return;
		}
		var text = processValue + "%";
		var process = processValue;
		context.clearRect(0, 0, 240, 240);
		context.globalAlpha = 1;
		//加载灰色进度条图片
		var img = document.getElementById("imgprocess");
		context.drawImage(img, 0, 0);
		context.globalCompositeOperation = "destination-out";

		//加载进度
		context.beginPath();
		context.moveTo(120, 120);
		context.arc(120, 120, 192, Math.PI * 1.5, Math.PI * 1.5 + Math.PI * 2 * process / 400, false);
		context.closePath();
		context.fillStyle = "#ccc";
		context.globalAlpha = 1;
		context.fill();

		context.globalCompositeOperation = "source-over";

		//输出数字
		context.font = "bold 4rem Arial";
		context.fillStyle = '#adaeb2';
		// context.shadowBlur=20;
		// context.shadowColor="#FFF";
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.moveTo(120, 120);
		context.globalAlpha = 1;
		if (tanhao) {
			context.fillText("!!", 120, 110);
		} else {
			context.fillText(Math.abs(parseInt((processSpeed * processValue) / 1000) - 8), 120, 110);
		}
		context.font = "normal 1rem Arial";
		context.fillText("sec", 120, 150);
		processValue += 1;
	}
	var processValue = 0; //开始进度
	var endValue = 100; //停止进度
	var processSpeed = 20; //速度控制
	var canvas = document.getElementById("canvas-process");
	var context = canvas.getContext('2d');

	var handTime = null;
	var handi = 0;

	var imgload = false;
	if (document.getElementById('imgprocess').complete) {
		imgload = true;
	}
	document.getElementById('imgprocess').onload = function() {
		imgload = true;
	};


	var skipstart = false;
	$("#canvas-btn").on("touchstart", function() {
		thisstaus = 1;
		$("#hand-message").text("准备开始")
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
			if (handi === 1 && skipstart == false) {
				$(".step-2").fadeOut(300, function() {
					$(".step-3").fadeIn(300, function() {
						$(".bottom li").eq(2).addClass('active').siblings('li').removeClass('active')
						$(".bottom .step").animate({
							width: 75 + "%"
						})
					});
				});
			}
			if (handi > 50 && handi <= 450) {
				skipstart = true;
				tanhao = false;
				drawProcess();
				$("#hand-message").text("按住按钮，持续吹气");
			}
			if (handi > 450) {
				tanhao = false;
				$("#hand-message").text("完成");
				$("#canvas-btn").hide();
				clearInterval(handTime);
				handi = 0;
				processOpen();
			}
		}, 20)
		$("#canvas-btn").on("touchend", function(e) {
			if (thisstaus != 1) {
				return;
			}
			initDraw();
		})
	});

	function initDraw() {
		$("#hand-message").text("按钮已松开，请重新吹气");
		tanhao = true;
		drawProcess();
		processValue = 0;
		handi = 0;
		clearInterval(handTime);
	}
	function processOpen(){
		//成功
	}
})