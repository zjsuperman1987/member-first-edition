var refresher = {
    spec: {},
    info: {
        pullDownLable: '',
        pullingDownLable: 'Release to refresh...',
        pullUpLable: '',
        pullingUpLable: 'Release to load more...',
        loadingLable: 'Loading...',
        pullingUpEnd: '已经没有更多了...'
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
            minY: -pullUpOffset,
            pullUpOffset: pullUpOffset,
            onRelease: function() {
                that.onRelease(this, pullDownDIV, pullDownLableDIV, parameter.pullDownAction, pullUpDIV, pullUpLableDIV);
            }
        });

     

        // 重置 resetPosition 方法
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
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x == this.x && y == this.y) {
                return false;
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        };
        this.spec[parameter.id].resetPosition();


        // 滚动中
        this.spec[parameter.id].on('scroll', function() {
            var y = this.y >> 0;

            //======================== 下拉动作 ========================
            // 开始下拉 -40 pullDownOffset
            if (y > -pullDownOffset && !pullDownDIV.classList.contains('loading')) {
                pullDownLableDIV.innerHTML = that.info.pullingDownLable;
            }

            // 上拉 maxY
            if (y < this.maxScrollY && !pullUpDIV.classList.contains('loading')) {
                pullUpLableDIV.innerHTML = that.info.pullingUpLable;
                if (this.options.updateContent) {
                    pullUpLableDIV.innerHTML = that.info.pullingUpEnd;
                }
            }

        });
        // 滚动结束
        this.spec[parameter.id].on('scrollEnd', function () {
            if (pullDownDIV.className.match('loading')){
                if (parameter.pullDownAction) parameter.pullDownAction();
            }
            if (pullUpDIV.className.match('loading')){
                if (parameter.pullUpAction) parameter.pullUpAction();
            } 
        })
        // 刷新
        this.spec[parameter.id].on('refresh', function () {
            if (pullDownDIV.className.match('loading')){
                pullDownDIV.classList.toggle('loading');
                pullDownDIV.style.lineHeight = '40px';
                pullDownDIV.querySelector('.loader').style.display = 'none';
                pullDownLableDIV.innerHTML = refresher.info.pullDownLable;
                this.options.minY = -pullDownOffset;
            }
            if (pullUpDIV.className.match('loading')){
                pullUpDIV.classList.toggle('loading');
                pullUpDIV.style.lineHeight = '40px';
                pullUpDIV.querySelector('.loader').style.display = 'none';
                pullUpLableDIV.innerHTML = refresher.info.pullUpLable;
            }
        })

    },
    onRelease: function(scroller, pullDownDIV, pullDownLableDIV, pullDownAction, pullUpDIV, pullUpLableDIV) {
        var y = scroller.y >> 0;

        if (y > 0 && scroller.startY >= -pullDownDIV.offsetHeight) {
            scroller.options.minY = 0;
            pullDownDIV.style.lineHeight = '20px';
            pullDownDIV.querySelector('.loader').style.display = 'block';
            pullDownLableDIV.innerHTML = refresher.info.loadingLable;
            pullDownDIV.classList.add('loading');
        }
        if (!scroller.options.updateContent) {
            if (y < scroller.maxScrollY - pullUpDIV.offsetHeight) {
                scroller.maxScrollY = scroller.wrapperHeight - scroller.scrollerHeight;
                pullUpDIV.style.lineHeight = '20px';
                pullUpDIV.querySelector('.loader').style.display = 'block';
                pullUpLableDIV.innerHTML = refresher.info.loadingLable;
                pullUpDIV.classList.add('loading');
            }
        }
    }
}