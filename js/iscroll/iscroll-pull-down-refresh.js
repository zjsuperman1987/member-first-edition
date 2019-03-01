var refresh = {
    info: {
        "pullDownLable": "",
        "pullingDownLable": "Release to refresh...",
        "pullUpLable": "",
        "pullingUpLable": "Release to load more...",
        "loadingLable": "Loading..."
    },
    init: function(parameter) {
        var wrapper,
            scroller,
            pullDown,
            pullDownLable,
            pullUp,
            pullUpLable,
            pullDownEl,
            pullDownOffset,
            pullUpEl,
            pullUpOffset,
            content,
            loader,
            list,
            div;

        // 创建滚动div
        wrapper = document.querySelector(parameter);
        div = document.createElement('div');
        div.className = 'scroller';
        wrapper.appendChild(div);
        // 插入UL
        scroller = document.querySelector('.scroller');
        list = document.querySelector('#' + wrapper.id + " ul");
        scroller.appendChild(list);
        // 创建下拉元素
        pullDown = document.createElement('div');
        pullDown.className = "pullDown";
        loader = document.createElement('div');
        loader.className = "loader";
        for (var i = 0; i < 4; i++) {
            var span = document.createElement('span');
            loader.appendChild(span);
        };
        pullDown.appendChild(loader);
        pullDownLable = document.createElement('div');
        pullDownLable.className = 'pullDownLable';
        pullDown.appendChild(pullDownLable);
        scroller.insertBefore(pullDown, scroller.childNodes[0]);

        // 创建上拉元素
        pullUp = document.createElement('div');
        pullUp.className = 'pullUp';
        loader = document.createElement('div')
        loader.className = 'loader';
        for (var i = 0; i < 4; i++) {
            var span = document.createElement('span');
            loader.appendChild(span);
        };
        pullUp.appendChild(loader);
        pullUpLable = document.createElement('div');
        pullUpLable.className = 'pullUpLable';
        content = document.createTextNode(refresh.info.pullUpLable);
        pullUpLable.appendChild(content);
        pullUp.appendChild(pullUpLable);
        scroller.appendChild(pullUp);

        // 取出加载元素高度
        pullDownEl = document.querySelector('.pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        pullUpEl = document.querySelector('.pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        this.scrollIt(wrapper, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset);

    },
    scrollIt: function(wrapper, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset) {
        this.info[wrapper.id] = new IScroll(wrapper, {
            probeType: 3,
            bounce: false,
        });
        this.info[wrapper.id].on('scroll', function() {
        	 var y = this.y >> 0;
        	 console.log(y);

        })
        this.info[wrapper.id].on('scrollEnd', function() {

        })
    }
}