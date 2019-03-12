var refresher = {
    spec: {},
    info: {
        pullDownLable: '',
        pullingDownLable: 'Release to refresh...',
        pullUpLable: '',
        pullingUpLable: 'Release to load more...',
        loadingLable: 'Loading...',
        pullingUpEnd: '已经没有更多了...',
        netError: '请求发生异常,稍稍休息一下'
    },
    init: function(parameter) {

        // 初始scroller
        var wrapper = document.querySelector(parameter.id);
        var scrollerDIV = document.createElement('div');
        scrollerDIV.classList.add('scroller');
        wrapper.appendChild(scrollerDIV);
        scrollerDIV = wrapper.querySelector('.scroller');
        scrollerDIV.appendChild(wrapper.querySelector('ul'));

        // 初始化下拉元素
        var pullDownDIV = document.createElement('div');
        pullDownDIV.classList.add('pullDown');
        scrollerDIV.insertBefore(pullDownDIV, wrapper.querySelector('ul'));

        var loaderDIV = document.createElement('div');
        loaderDIV.classList.add('loader');
        for (i = 0; i <= 4; i++) {
            var span = document.createElement('span');
            loaderDIV.appendChild(span);
        };
        pullDownDIV.appendChild(loaderDIV);

        var pullDownLableDIV = document.createElement('div');
        pullDownLableDIV.classList.add('pullDownLable');
        pullDownDIV.appendChild(pullDownLableDIV)


        // 初始化上拉元素
        var pullUpDIV = document.createElement('div');
        pullUpDIV.classList.add('pullUp');
        scrollerDIV.appendChild(pullUpDIV, wrapper.querySelector('ul'));

        var loaderDIV = document.createElement('div');
        loaderDIV.classList.add('loader');
        for (i = 0; i <= 4; i++) {
            var span = document.createElement('span');
            loaderDIV.appendChild(span);
        };
        pullUpDIV.appendChild(loaderDIV);

        var pullUpLableDIV = document.createElement('div');
        pullUpLableDIV.classList.add('pullUpLable');
        pullUpDIV.appendChild(pullUpLableDIV);

        // 上拉 下拉 动画 高度
        var pullDownOffset = pullDownDIV.offsetHeight;
        var pullUpOffset = pullUpDIV.offsetHeight;


        // 初始化iscroll
        this.scrollIt(parameter, pullDownDIV, pullDownLableDIV, pullDownOffset, pullUpDIV, pullUpLableDIV, pullUpOffset);
    },
    scrollIt: function(parameter, pullDownDIV, pullDownLableDIV, pullDownOffset, pullUpDIV, pullUpLableDIV, pullUpOffset) {
        var that = this;

        this.spec[parameter.id] = new IScroll(parameter.id, {
            probeType: 3,
            tap: true,
            minY: -pullDownOffset,
            onRelease: function(scroller) {
                var y = scroller.y >> 0;
                // 下拉 释放
                if (y > 0 && scroller.startY >= -pullDownOffset) {
                    var loaderDown = pullDownDIV.querySelector('.loader');
                    loaderDown.style.display = 'block';
                    pullDownDIV.style.lineHeight = '20px';
                    pullDownDIV.classList.add('loading');
                    pullDownLableDIV.innerHTML = that.info.loadingLable;
                    scroller.options.minY = 0;
                }
            },
            scrollbars: 'custom',
            resizeScrollbars: false,
            fadeScrollbars: true,
            shrinkScrollbars: 'clip',
            indicators: {
                el: '.iScrollVerticalScrollbar', 
                ignoreBoundaries: false,
            }




        });
        //添加 refresh
        this.spec[parameter.id].on('refresh', function() {
            var wrapper = document.querySelector(parameter.id),
                scroller = wrapper.querySelector('.scroller'),
                rect = IScroll.utils.getRect(scroller);

            /* REPLACE START: refresh */

            this.scrollerHeight = rect.height;
            // custom_by_jz
            if (this.wrapperHeight - this.scrollerHeight >= 0) {
                this.scrollerHeight = this.wrapperHeight + 1;
            }

            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
            // custom_by_jz
            if (this.maxScrollY === -1) {
                this.options.maxY = this.maxScrollY - pullUpOffset;
            } else {
                this.options.maxY = this.maxScrollY < (-pullUpOffset - 1) ? this.maxScrollY : (-pullUpOffset - 1);
            }

            /* REPLACE END: refresh */

            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
            // 恢复 初始
            if (pullDownDIV.classList.contains('loading')) {
                var loaderDown = pullDownDIV.querySelector('.loader');
                pullDownDIV.classList.remove('loading');
                pullDownDIV.style.lineHeight = '40px';
                pullDownLableDIV.innerHTML = that.info.pullDownLable;
                pullUpLableDIV.innerHTML = that.info.pullUpLable;
                loaderDown.style.display = 'none';
                this.options.minY = -pullDownOffset;

            }
            if (pullUpDIV.classList.contains('loading')) {
                var loaderUp = pullUpDIV.querySelector('.loader');
                pullUpDIV.classList.remove('loading');
                pullUpDIV.style.lineHeight = '40px';
                pullUpLableDIV.innerHTML = this.options.net_error ? that.info.netError : this.options.no_more_data ? that.info.pullingUpEnd : that.info.pullUpLable;
                loaderUp.style.display = 'none';
            }
        })
        this.spec[parameter.id].refresh();
        // 重写 resetPosition;
        this.spec[parameter.id].resetPosition = function(time) {
            var x = this.x,
                y = this.y;

            time = time || 0;

            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > this.options.minY) {
                y = this.options.minY;
            } else if (this.y < this.options.maxY) {
                y = this.options.maxY;
            }

            if (x == this.x && y == this.y) {
                return false;
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        }
        this.spec[parameter.id].resetPosition();
        // 滚动 开始
        this.spec[parameter.id].on('beforeScrollStart', function() {
            // 滚动中点击
            this.options.on_scrolling = false;
        });

        //滚动
        this.spec[parameter.id].on('scroll', function() {
            var y = this.y >> 0;
            // 下拉
            if (y > -pullDownOffset && !pullDownDIV.classList.contains("loading")) {
                pullDownLableDIV.innerHTML = that.info.pullingDownLable;
            }
            // 滚动中点击
            this.options.on_scrolling = true;
        });
        // 滚动结束
        this.spec[parameter.id].on('scrollEnd', function() {
            var y = this.y >> 0;
            // 上拉
            if (y <= this.options.maxY && !this.options.no_more_data) {
                var loaderUp = pullUpDIV.querySelector('.loader');

                loaderUp.style.display = 'block';
                pullUpDIV.classList.add('loading');
                pullUpDIV.style.lineHeight = '20px';
                pullUpLableDIV.innerHTML = that.info.loadingLable;
            }
            if (pullDownDIV.classList.contains('loading')) {
                if (parameter.pullDownAction) {
                    parameter.pullDownAction();
                }
            }
            if (pullUpDIV.classList.contains('loading')) {
                if (parameter.pullUpAction) {
                    parameter.pullUpAction();
                }
            }
        });
    },
}