var refresher = {
    me: {},
    info: {
        pullDownLable: '',
        pullingDownLable: 'Release to refresh...',
        pullUpLable: '',
        pullingUpLable: 'Release to load more...',
        loadingLable: 'loading...',
        noDataLable: '已经没有数据了...',
        netErrorLable: '网络请求异常,歇一会'
    },
    init: function(parameter) {
        var wrapper, scroller, ul,
            pullDown, pullUp,
            loader, span,
            pullDownLable, pullUpLable;


        // 插入 scroller
        wrapper = document.querySelector(parameter.id);
        scroller = document.createElement('div');
        scroller.className = 'scroller';
        ul = wrapper.querySelector('ul');
        scroller.appendChild(ul);
        wrapper.appendChild(scroller);

        // 插入 下拉
        pullDown = document.createElement('div');
        pullDown.className = 'pullDown';
        loader = document.createElement('div');
        loader.className = 'loader';
        for (var i = 0; i <= 4; i++) {
            span = document.createElement('span');
            loader.appendChild(span);
        };
        pullDownLable = document.createElement('div');
        pullDownLable.className = 'pullDownLable';
        pullDown.appendChild(loader);
        pullDown.appendChild(pullDownLable);
        scroller.insertBefore(pullDown, scroller.childNodes[0]);

        // 插入 上拉
        pullUp = document.createElement('div');
        pullUp.className = 'pullUp';
        loader = document.createElement('div');
        loader.className = 'loader';
        for (var i = 0; i <= 4; i++) {
            span = document.createElement('span');
            loader.appendChild(span);
        };
        pullUpLable = document.createElement('div');
        pullUpLable.className = 'pullUpLable';
        pullUp.appendChild(loader);
        pullUp.appendChild(pullUpLable);
        scroller.appendChild(pullUp);

        // 初始IScroll
        pullDownOffset = pullDown.offsetHeight;
        pullUpOffset = pullUp.offsetHeight;
        this.scrollIt(parameter, pullDown, pullDownLable, pullDownOffset, pullUp, pullUpLable, pullUpOffset, wrapper, scroller);
    },
    scrollIt: function(parameter, pullDown, pullDownLable, pullDownOffset, pullUp, pullUpLable, pullUpOffset, wrapper, scroller) {
        var that = this,
            loaderDown = pullDown.querySelector('.loader'),
            loaderUp = pullUp.querySelector('.loader');

        var scroller = new IScroll(parameter.id, {
            probeType: 3,
            startY: -pullDownOffset,
            minY: -pullDownOffset,
            tap: true,
            scrollbars: 'custom',
            resizeScrollbars: false,
            fadeScrollbars: true,
            shrinkScrollbars: 'scale',
            HWCompositing: false,
            onRelease: function() {
                var y = this.y >> 0;
                if (y > 0) {
                    pullDown.style.lineHeight = '20px';
                    loaderDown.style.display = 'block';
                    pullDown.classList.add('loading');
                    pullDownLable.innerHTML = that.info.loadingLable;
                    this.options.minY = 0;
                }
            }
        });
        this.me[parameter.id] = scroller;


        scroller.resetPosition = function(time) {
            var x = this.x,
                y = this.y;

            time = time || 0;
            // custom_by_jz
            if (this.maxScrollY > -pullUpOffset) {
                this.maxScrollY = -pullUpOffset;
            }

            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > this.options.minY) {
                y = this.options.minY;
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x == this.x && y == this.y) {
                return false;
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        };

        // 处理滚动中点击
        scroller.on('beforeScrollStart', function() {
            this.options.onScrolling = false;
        });

        scroller.on('scroll', function() {
            var y = this.y >> 0;

            if (y > -pullDownOffset && !pullDown.classList.contains('loading')) {
                pullDownLable.innerHTML = that.info.pullingDownLable;
            }
            if (y <= this.maxScrollY && this.maxScrollY !== 0) {
                if (!this.options.noData) {
                    pullUp.style.lineHeight = '20px';
                    loaderUp.style.display = 'block';
                    pullUp.classList.add('loading');
                    pullUpLable.innerHTML = that.info.loadingLable;
                } else {
                    pullUp.style.lineHeight = '40px';
                    loaderUp.style.display = 'none';
                    pullUp.classList.remove('loading');
                    pullUpLable.innerHTML = that.info.noDataLable;
                }
            }
            this.options.onScrolling = true;
        });
        scroller.on('scrollEnd', function() {
            var y = this.y >> 0;

            if (pullDown.classList.contains('loading')) {
                if (parameter.pullDownAction) parameter.pullDownAction();
            }
            if (y === this.maxScrollY && pullUp.classList.contains('loading')) {
                if (parameter.pullUpAction) parameter.pullUpAction();
            }
        });
        scroller.on('refresh', function() {
            if (pullDown.classList.contains('loading')) {
                pullDown.style.lineHeight = '40px';
                loaderDown.style.display = 'none';
                pullDown.classList.remove('loading');
                pullDownLable.innerHTML = that.info.pullDownLable;
                pullUpLable.innerHTML = that.info.pullUpLable;
                this.options.minY = -pullDownOffset;
            }
            if (pullUp.classList.contains('loading')) {
                pullUp.style.lineHeight = '40px';
                loaderUp.style.display = 'none';
                pullUp.classList.remove('loading');
                if (this.options.noData) {
                    pullUpLable.innerHTML = that.info.noDataLable;
                } else {
                    pullUpLable.innerHTML = that.info.pullUpLable;
                }
            }
        })
    },
}