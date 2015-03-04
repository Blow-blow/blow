/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
 */

function Swipe(container, options) {

    "use strict";

    // utilities
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) {
        setTimeout(fn || noop, 0)
    }; // offload a functions execution

    // check browser capabilities
    var browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function(temp) {
            // 检测是否支持transitions属性
            var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
            for (var i in props)
                if (temp.style[props[i]] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };

    // quit if no root element
    // 如果不存在根对象 返回
    if (!container) return;
    var element = container.children[0];
    var slides, slidePos, width, length;
    options = options || {};
    var index = parseInt(options.startSlide, 10) || 0; // 滑动索引值
    var speed = options.speed || 300; // 滑动速度
    options.continuous = options.continuous !== undefined ? options.continuous : true; //是否循环滑动
    length = element.children.length;
    // debugger
    function setup() {

        // cache slides
        slides = element.children;

        // set continuous to false if only one slide
        // 如果仅有一个幻灯片
        if (slides.length < 2) options.continuous = false;

        //special case if two slides
        //如果有两个幻灯片
        if (browser.transitions && options.continuous && slides.length < 3) {
            // 克隆幻灯片
           element.appendChild(slides[0].cloneNode(true));
           element.appendChild(element.children[1].cloneNode(true));
           slides = element.children;
        }

        // create an array to store current positions of each slide
        // 创建一个数组来存储每个幻灯片的当前位置
        slidePos = new Array(slides.length);

        // determine width of each slide
        // 确定每个幻灯片的宽度
        width = container.getBoundingClientRect().width || container.offsetWidth;

        element.style.width = (slides.length * width) + 'px';

        // stack elements
        // 初始化元素
        var pos = slides.length;
        // 倒序遍历
        while (pos--) {

            var slide = slides[pos];

            slide.style.width = width + 'px';
            slide.setAttribute('data-index', pos);

            if (browser.transitions) {
                slide.style.left = (pos * -width) + 'px';
                move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
            }

        }

        // reposition elements before and after index
        // 重新定位元素之前和之后的索引
        if (options.continuous && browser.transitions) {
            move(circle(index - 1), -width, 0);
            move(circle(index + 1), width, 0);
        }
        // 如果不能使用transitions方法，那么讲父级位置定义到开始滑动位置
        if (!browser.transitions) element.style.left = (index * -width) + 'px';

        // 当所有都准备好了 在把跟父级显示出来
        container.style.visibility = 'visible';

    }
    // 上翻
    function prev() {

        if (options.continuous) slide(index - 1);
        else if (index) slide(index - 1);

    }
    // 下翻
    function next() {
        if (options.continuous) slide(index + 1);
        else if (index < slides.length - 1) slide(index + 1);
    }

    // 返回正确的下标
    function circle(index) {
        // 因为传过来的下标 会有负数情况 所以加入slides.length
        // a simple positive modulo using slides.length
        return (slides.length + (index % slides.length)) % slides.length;


    }
    // 滑动
    function slide(to, slideSpeed) {

        // do nothing if already on requested slide
        // 防止重复滑动
        if (index == to) return;

        if (browser.transitions) {
            // 方向：  1: 向后   -1 向前
            var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

            // get the actual position of the slide
            // 如果轮播 那么计算实际的下滑目标
            if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[circle(to)] / width;

                // if going forward but to < index, use to = slides.length + to
                // if going backward but to > index, use to = -slides.length + to
                if (direction !== natural_direction) {
                    // debugger
                    to = -direction * slides.length + to;
                }

            }

            var diff = Math.abs(index - to) - 1;
            // console.log("diff："+diff);
            // move all the slides between index and to in the right direction
            while (diff--) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);

            to = circle(to);

            move(index, width * direction, slideSpeed || speed);
            move(to, 0, slideSpeed || speed);

            if (options.continuous) {
                // 准备好下一个幻灯片
                move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
            }

        } else {

            to = circle(to);
            animate(index * -width, to * -width, slideSpeed || speed);
            //no fallback for a circular continuous if the browser does not accept transitions
        }

        index = to;
        // 将元素的下标 和 元素传入回调函数中
        offloadFn(options.callback && options.callback(index, slides[index]));
    }
    // 位移
    function move(index, dist, speed) {

        translate(index, dist, speed);
        slidePos[index] = dist;

    }

    function translate(index, dist, speed) {

        var slide = slides[index];
        var style = slide && slide.style;

        if (!style) return;

        style.webkitTransitionDuration =
            style.MozTransitionDuration =
                style.msTransitionDuration =
                    style.OTransitionDuration =
                        style.transitionDuration = speed + 'ms';
        // 3D加速
        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
                style.OTransform = 'translateX(' + dist + 'px)';

    }

    function animate(from, to, speed) {

        // if not an animation, just reposition
        if (!speed) {

            element.style.left = to + 'px';
            return;

        }

        var start = +new Date;

        var timer = setInterval(function() {

            var timeElap = +new Date - start;

            if (timeElap > speed) {

                element.style.left = to + 'px';

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                clearInterval(timer);
                return;

            }

            element.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';

        }, 4);

    }

    // setup auto slideshow
    var delay = options.auto || 0;
    var interval,isEnablePause=false;

    function begin() {
        if(!isEnablePause){
            stop();
            interval = setTimeout(next, delay);
        }
    }

    function stop() {
        // delay = 0;
        if(interval){
             clearTimeout(interval);
            interval = null;
        }
    }
    function play(){
        isEnablePause=false;
        begin();
    }
    // 暂停
    function pause(){
        stop();
        isEnablePause=true;
    }

    // setup initial vars
    var start = {};
    var delta = {};
    var isScrolling;

    // setup event capturing
    // 捕获事件
    var events = {

        handleEvent: function(event) {

            switch (event.type) {
                case 'touchstart':
                    this.start(event);
                    break;
                case 'touchmove':
                    this.move(event);
                    break;
                case 'touchend':
                    offloadFn(this.end(event));
                    break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend':
                    offloadFn(this.transitionEnd(event));
                    break;
                case 'resize':
                    offloadFn(setup);
                    break;
            }

            if (options.stopPropagation) event.stopPropagation();

        },
        start: function(event) {

            var touches = event.touches[0];

            // measure start values
            // 获取初始坐标
            start = {

                // get initial touch coords
                x: touches.pageX,
                y: touches.pageY,

                // store time to determine touch duration
                // 获取开始时间戳
                time: +new Date

            };

            // used for testing first move event
            isScrolling = undefined;

            // reset delta and end measurements
            delta = {};

            // attach touchmove and touchend listeners
            element.addEventListener('touchmove', this, false);
            element.addEventListener('touchend', this, false);

        },
        move: function(event) {

            // ensure swiping with one touch and not pinching
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return
            // alert(options.disableScroll)
            if (options.disableScroll) event.preventDefault();

            var touches = event.touches[0];

            // measure change in x and y
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            }

            // determine if scrolling test has run - one time test
            if (typeof isScrolling == 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
            }
            // if user is not trying to scroll vertically
            if (!isScrolling) {

                // prevent native scrolling
                event.preventDefault();

                // stop slideshow
                stop();

                // increase resistance if first or last slide
                if (options.continuous) { // we don't add resistance at the end

                    translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);

                } else {

                    delta.x =
                        delta.x /
                        ((!index && delta.x > 0 // if first slide and sliding left
                            || index == slides.length - 1 // or if last slide and sliding right
                            && delta.x < 0 // and if sliding at all
                            ) ?
                            (Math.abs(delta.x) / width + 1) // determine resistance level
                            : 1); // no resistance if false

                    // translate 1:1
                    translate(index - 1, delta.x + slidePos[index - 1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index + 1, delta.x + slidePos[index + 1], 0);
                }

            }

        },
        end: function(event) {

            // measure duration
            var duration = +new Date - start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250 // if slide duration is less than 250ms
                && Math.abs(delta.x) > 20 // and if slide amt is greater than 20px
                || Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

            // determine if slide attempt is past start and end
            var isPastBounds = !index && delta.x > 0 // if first slide and slide amt is greater than 0
                || index == slides.length - 1 && delta.x < 0; // or if last slide and slide amt is less than 0

            if (options.continuous) isPastBounds = false;

            // determine direction of swipe (true:right, false:left)
            var direction = delta.x < 0;

            // if not scrolling vertically
            if (!isScrolling) {

                if (isValidSlide && !isPastBounds) {

                    if (direction) {

                        if (options.continuous) { // we need to get the next in this direction in place

                            move(circle(index - 1), -width, 0);
                            move(circle(index + 2), width, 0);

                        } else {
                            move(index - 1, -width, 0);
                        }

                        move(index, slidePos[index] - width, speed);
                        move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                        index = circle(index + 1);

                    } else {
                        if (options.continuous) { // we need to get the next in this direction in place

                            move(circle(index + 1), width, 0);
                            move(circle(index - 2), -width, 0);

                        } else {
                            move(index + 1, width, 0);
                        }

                        move(index, slidePos[index] + width, speed);
                        move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                        index = circle(index - 1);

                    }

                    options.callback && options.callback(index, slides[index]);

                } else {

                    if (options.continuous) {

                        move(circle(index - 1), -width, speed);
                        move(index, 0, speed);
                        move(circle(index + 1), width, speed);

                    } else {

                        move(index - 1, -width, speed);
                        move(index, 0, speed);
                        move(index + 1, width, speed);
                    }

                }

            }

            // kill touchmove and touchend event listeners until touchstart called again
            element.removeEventListener('touchmove', events, false)
            element.removeEventListener('touchend', events, false)

        },
        transitionEnd: function(event) {

            if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

            }

        }

    }

    // trigger setup
    setup();

    // start auto slideshow if applicable
    if (delay) begin();// setTimeout(next, delay/2); 


    // add event listeners
    if (browser.addEventListener) {

        // set touchstart event on element
        if (browser.touch) element.addEventListener('touchstart', events, false);

        if (browser.transitions) {
            element.addEventListener('webkitTransitionEnd', events, false);
            element.addEventListener('msTransitionEnd', events, false);
            element.addEventListener('oTransitionEnd', events, false);
            element.addEventListener('otransitionend', events, false);
            element.addEventListener('transitionend', events, false);
        }

        // set resize event on window
        window.addEventListener('resize', events, false);

    } else {

        window.onresize = function() {
            setup()
        }; // to play nice with old IE

    }

    // expose the Swipe API
    return {
        setup: function() {

            setup();

        },
        slide: function(to, speed) {

            // cancel slideshow
            stop();

            slide(to, speed);

        },
        prev: function() {

            // cancel slideshow
            stop();

            prev();

        },
        next: function() {

            // cancel slideshow
            stop();

            next();

        },
        // 播放
        play:function(){
            play();
        },
        // 暂停
        pause:function(){
            pause();
        },
        stop: function() {

            // cancel slideshow
            stop();

        },

        getPos: function() {

            // return current index position
            return index;

        },
        getNumSlides: function() {

            // return total number of slides
            return length;
        },
        kill: function() {

            // cancel slideshow
            stop();

            // reset element
            element.style.width = '';
            element.style.left = '';

            // reset slides
            var pos = slides.length;
            while (pos--) {

                var slide = slides[pos];
                slide.style.width = '';
                slide.style.left = '';

                if (browser.transitions) translate(pos, 0, 0);

            }

            // removed event listeners
            if (browser.addEventListener) {

                // remove current event listeners
                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
                window.removeEventListener('resize', events, false);

            } else {

                window.onresize = null;

            }

        }
    }

}


if (window.jQuery || window.Zepto) {
    (function($) {
        $.fn.Swipe = function(params) {
            return this.each(function() {
                $(this).data('Swipe', new Swipe($(this)[0], params));
            });
        }
    })(window.jQuery || window.Zepto)
}