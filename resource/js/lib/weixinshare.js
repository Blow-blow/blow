var global_origin = window.location.origin || (window.location.protocol + '//' + window.location.hostname);
var global_lineLink = global_origin + "/blow_test/public/";
var WeiXinShare = {
	imgUrl: global_origin + "/blow_test/public/resource/images/icon.png", //注意必须是绝对路径
	lineLink: global_lineLink, //同样，必须是绝对路径  
	shareTitle: '运足气，对屏吹！惊喜好礼等你拿！', //分享title
	descContent: '真朋友，对屏吹', //分享给朋友或朋友圈时的文字简介
	appid: "", //apiID，可留空
	img_width: "100",
	img_height: "100"
};
// alert(WeiXinShare.imgUrl)
var TWeiXinCount = function() {

}
if (!window.wx) {
	function shareFriend() {
		WeixinJSBridge.invoke('sendAppMessage', {
			"appid": WeiXinShare.appid,
			"img_url": WeiXinShare.imgUrl,
			"img_width": WeiXinShare.img_width,
			"img_height": WeiXinShare.img_height,
			"link": WeiXinShare.lineLink,
			"desc": WeiXinShare.shareTitle,
			"title": WeiXinShare.descContent
		}, function(res) {
			TWeiXinCount();
			//_report('send_msg', res.err_msg);
		});
	};

	function shareTimeline() {
		WeixinJSBridge.invoke('shareTimeline', {
			"img_url": WeiXinShare.imgUrl,
			"img_width": WeiXinShare.img_width,
			"img_height": WeiXinShare.img_height,
			"link": WeiXinShare.lineLink,
			"desc": WeiXinShare.descContent,
			"title": WeiXinShare.shareTitle
		}, function(res) {
			TWeiXinCount();
			//_report('timeline', res.err_msg);
		});
	};

	function shareWeibo() {
		WeixinJSBridge.invoke('shareWeibo', {
			"content": WeiXinShare.descContent,
			"url": WeiXinShare.lineLink,
		}, function(res) {
			//_report('weibo', res.err_msg);
		});
	};
	// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		// 发送给好友
		WeixinJSBridge.on('menu:share:appmessage', function(argv) {
			shareFriend();
		});
		// 分享到朋友圈
		WeixinJSBridge.on('menu:share:timeline', function(argv) {
			shareTimeline();
		});
		// 分享到微博
		WeixinJSBridge.on('menu:share:weibo', function(argv) {
			shareWeibo();
		});
	}, false);
}

function weixin6() {
	wx.ready(function() {
		weixin6bySet();
	});
}

function weixin6bySet() {
	// 1 判断当前版本是否支持指定 JS 接口，支持批量判断
	// wx.checkJsApi({
	//   jsApiList: [
	//     'getNetworkType'
	//   ],
	//   success: function(res) {
	//     alert(JSON.stringify(res));
	//   }
	// });
	// 2. 分享接口
	// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口		
	wx.onMenuShareAppMessage({
		title: WeiXinShare.descContent,
		desc: WeiXinShare.shareTitle,
		link: WeiXinShare.lineLink,
		imgUrl: WeiXinShare.imgUrl,
		trigger: function(res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
			// alert('用户点击发送给朋友');
		},
		success: function(res) {
			TWeiXinCount();
			// alert('已分享');
		},
		cancel: function(res) {
			// alert('已取消');
		},
		fail: function(res) {
			// alert(JSON.stringify(res));
		}
	});

	// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
	wx.onMenuShareTimeline({
		title: WeiXinShare.shareTitle,
		link: WeiXinShare.lineLink,
		imgUrl: WeiXinShare.imgUrl,
		trigger: function(res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
			// alert('用户点击分享到朋友圈');
		},
		success: function(res) {
			TWeiXinCount();
			// alert('已分享');
		},
		cancel: function(res) {
			// alert('已取消');
		},
		fail: function(res) {
			// alert(JSON.stringify(res));
		}
	});
	// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
	// wx.onMenuShareQQ({
	// 	title: WeiXinShare.shareTitle,
	// 	desc: WeiXinShare.descContent,
	// 	link: WeiXinShare.lineLink,
	// 	imgUrl: WeiXinShare.imgUrl,
	// 	trigger: function(res) {
	// 		alert('用户点击分享到QQ');
	// 	},
	// 	complete: function(res) {
	// 		alert(JSON.stringify(res));
	// 	},
	// 	success: function(res) {
	// 		alert('已分享');
	// 	},
	// 	cancel: function(res) {
	// 		alert('已取消');
	// 	},
	// 	fail: function(res) {
	// 		alert(JSON.stringify(res));
	// 	}
	// });
	// // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
	// wx.onMenuShareWeibo({
	// 	title: WeiXinShare.shareTitle,
	// 	desc: WeiXinShare.descContent,
	// 	link: WeiXinShare.lineLink,
	// 	imgUrl: WeiXinShare.imgUrl,
	// 	trigger: function(res) {
	// 		alert('用户点击分享到微博');
	// 	},
	// 	complete: function(res) {
	// 		alert(JSON.stringify(res));
	// 	},
	// 	success: function(res) {
	// 		alert('已分享');
	// 	},
	// 	cancel: function(res) {
	// 		alert('已取消');
	// 	},
	// 	fail: function(res) {
	// 		alert(JSON.stringify(res));
	// 	}
	// });
}