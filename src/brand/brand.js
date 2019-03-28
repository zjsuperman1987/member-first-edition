window.onload = function() {
    brand.init_navigation();
    brand.init_swiper();
    brand.init_click();

}

var brand = (function() {
    return {
        me: {
            count: [],
            inited_slide: [],
            page_name: ['recommend', 'floor', 'formate', 'age', 'sex', 'day', 'welfare', 'lottery']
        },
        init_navigation: function() {
            var that = this,
                width = 0;

            $('.h_wrapper li').first().append('<i>').find('i').addClass('move_line');
            $('.v_navigation .vn_item').each(function(i) {
                width += parseFloat($(this).css('width'));
                that.me.count.push(0);
            });

            $('.h_wrapper ul').css('width', Math.ceil(width) + 6 + 'px');

            brand.navigation = new IScroll('.h_wrapper', {
                probeType: 3,
                scrollX: true,
                scrollY: false,
                tap: true
            });
            // 添加点击事件
            $('.vn_item').on('tap', function() {
                var index = $(this).index();
                brand.swiper.slideTo(index);
                window[that.me.page_name[that.swiper.activeIndex]].init();

            })
        },

        init_swiper: function() {
            var that = this,
                ratio = 0,
                move_ratio = 0,
                move_index = 0,
                translateX = 0;

            function set_translate(translate) {
                $('.vn_item').eq(0).append($('.move_line'));
                $('.move_line').css('transform', 'translate(' + (-this.translate * ratio) + 'px)');
            }

            function transitionStart() {
                $('.vn_item').eq(this.activeIndex).append($('.move_line')).find('.move_line').css('transform', 'translate(0)');
            }

            function transitionEnd() {
                // 打开 选择页面
                if (this.previousIndex === 1) {
                    $('.floorList').show();
                    floor.me.count = 0;
                    $('#wrapper1').find('.pullUpLable').text('');
                    $('#wrapper1 ul').empty();
                    if (refresher.me['#wrapper1']) {
                        refresher.me['#wrapper1'].scrollTo(0, 0);
                        refresher.me['#wrapper' + this.previousIndex].options.noData = false;
                    }
                }
            }

            function slide_change() {
                // 添加头部效果
                $('.v_navigation li').find('span').
                removeClass('active-vn-item')
                    .eq(this.activeIndex)
                    .addClass('active-vn-item');

                // 向左移动
                if (this.activeIndex > this.previousIndex) {
                    if (this.activeIndex >= move_index) {
                        translateX = translateX + move_ratio <= brand.navigation.maxScrollX ? brand.navigation.maxScrollX : translateX + move_ratio;
                        brand.navigation.scrollTo(translateX, 0);
                    }
                } else {
                    translateX = translateX - move_ratio >= 0 ? 0 : translateX - move_ratio;
                    brand.navigation.scrollTo(translateX, 0);
                }

                // 初始化页面
                if (!that.me.inited_slide[this.activeIndex]) {
                    // 加载等待页面
                    var slide = this.slides[this.activeIndex];
                    footer.loadingRefresh(slide);
                    window[that.me.page_name[this.activeIndex]].init();
                }
            }


            var page = $('.v_navigation li'),
                len = page.length,
                i = 0;

            this.swiper = new Swiper('.swiper-container', {
                watchSlidesProgress: true,
                resistanceRatio: 0,
                on: {
                    setTranslate: set_translate,
                    transitionStart: transitionStart,
                    transitionEnd: transitionEnd,
                    slideChange: slide_change
                }
            });
            // 创建slide
            for (; i < len; i++) {
                this.swiper.addSlide(i, `<div class="swiper-slide">
                                            <div id="wrapper${i}">
                                                <ul></ul>
                                            </div>
                                        </div>`);
                this.me.inited_slide[i] = false;
            }
            $('.swiper-slide>div').css({ 'width': '100%', 'height': '100%' });

            ratio = parseFloat($('.h_wrapper ul').css('width')) / (this.swiper.width * this.swiper.slides.length);
            move_ratio = brand.navigation.maxScrollX / (this.swiper.slides.length / 2);
            move_index = this.swiper.slides.length / 2 - 1;
            translateX = 0;

            if (!that.me.inited_slide[this.swiper.activeIndex]) {
                // 加载等待
                footer.loadingRefresh(that.swiper.slides[that.swiper.activeIndex]);
                window[that.me.page_name[this.swiper.activeIndex]].init();

            }
        },

        init_click: function() {
            document.querySelector('.header').addEventListener('touchstart', function() {
                var div = document.createElement('div');
                div.id = 'search_wrapper';
                $('body').append(div).find('#search_wrapper').load('src/common/search.html .active_search_page');
                active_search.init_search_page('brand');
            });
        }
    }
})();


// 推荐
var recommend = (function() {
    var wrapper;

    return {
        me: {
            count: 0,
            inited_scroll: false
        },
        init: function(state) {
            var that = this;
            wrapper = '#wrapper' + brand.swiper.activeIndex;

            brand.me.inited_slide[brand.swiper.activeIndex] = true;

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/brand')
                .then(function(response) {
                    var i = 0,
                        len,
                        data = response.data,
                        count = that.me.count;

                    if (data && data.length !== 0) {
                        // 有数据
                        data = data.recommend;
                        len = data.length;

                        if (state === 'pullDown') {
                            $(wrapper + ' ul').empty();
                        }

                        for (; i < 5; i++) {
                            if (count < len) {
                                $(wrapper + ' ul').append(` <li class='wrapper_item'>
                                            <div class='w_item_left'>
                                                <img src="${data[count].imgUrl}">
                                            </div>
                                            <div class='w_item_right'>
                                                <div class='w_item_right_top'>
                                                    <div class='introduction'>
                                                        <span class='brandName'>${data[count].brandName}</span>
                                                        <span class='formate'>(${data[count].formate})</span>
                                                        <i>${data[count].isFavorite === 0 ? '未关注' : '已关注'}</i>
                                                    </div>
                                                </div>
                                                <div class='w_item_right_bottom'>
                                                    <span>${data[count].active}</span>
                                                </div>
                                            </div>
                                        </li>`);
                                that.me.count = count = count + 1;
                            }
                        }
                        // 初始化 IScroll
                        if (!that.me.inited_scroll) {
                            that.me.inited_scroll = true;
                            recommend.init_scroll();
                        }

                        if (count === len) {
                            // 数据读取完毕
                            if (refresher.me[wrapper]) {
                                refresher.me[wrapper].options.noData = true;
                            }
                        }
                        // 刷新
                        if (refresher.me[wrapper]) {
                            var timer = setTimeout(function() {
                                refresher.me[wrapper].refresh();
                                clearTimeout(timer);
                            }, 0);
                        }
                    } else {
                        // 无数据
                    }
                    // 关闭等待页面
                    footer.closeLoadingRefresh();
                })
                .catch(function(error) {
                    console.log(error);
                })
        },
        init_scroll: function() {
            var that = this;
            refresher.init({
                id: wrapper,
                pullDownAction: function() {
                    that.me.count = 0;
                    refresher.me[wrapper].options.noData = false;
                    recommend.init('pullDown');
                },
                pullUpAction: function() {
                    recommend.init('pullUp');
                },
            })
        }
    }
})();


// 楼层
var floor = (function() {
    var slide, slideIndex, that;
    return {
        me: {
            count: 0,
            inited_scroll: false,
        },
        init: function() {

            that = this;
            slide = brand.swiper.slides[brand.swiper.activeIndex];
            slideIndex = brand.swiper.activeIndex;

            // 加载 楼栋
            this.init_build();


        },
        // 请求楼栋数据
        init_build: function() {
            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/brand')
                .then(function(response) {
                    var i = 0,
                        len,
                        data = response.data;
                    if (data && data.length !== 0 && !brand.me.inited_slide[slideIndex]) {
                        data = data.buildList;
                        len = data.length;
                        // 删除加载页面
                        footer.closeLoadingRefresh();
                        // 插入楼层选择页面 DOM 
                        $(slide).append(`<div class='floorList'> 
                                            <div class='building'></div>
                                        </div>`);
                        for (; i < len; i++) {
                            $('.building').append(`<span>${data[i].buildName}</span>`);
                        }
                        $('.floorList').show();
                        // 监听点击楼栋
                        document.querySelector('.building').addEventListener('touchstart', function(e) {
                            var event = window.event || e;
                            target = event.target || event.srcElement;
                            if (target.tagName.toLowerCase() === 'span') {
                                // 选中楼栋
                                $('.building span').removeClass('selectedBuild').eq($(target).index()).addClass('selectedBuild');
                                // 请求楼层
                                that.init_floor($(target).text());
                            }
                        });
                        document.querySelector('.building span').className = 'selectedBuild';
                        that.init_floor($('.building span:first-child').text());
                        // 执行一次代码完成
                        brand.me.inited_slide[slideIndex] = true;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        init_floor: function(build) {
            function generatorDOM() {
                // 插入DOM
                $('.floorList').append(`<div class='floor-img-swiper-container'>
                                                    <div class='swiper-wrapper'></div>
                                                </div>
                                                <div class='floor-item'></div>`);
                // 初始swiper
                that.me.swiper = new Swiper('.floor-img-swiper-container', {
                    nested: true,
                    on: {
                        slideChange: function() {
                            $('.floor-item span').removeClass('selectedFloor').eq(this.activeIndex).addClass('selectedFloor');
                        }
                    }
                });
            }

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/brand')
                .then(function(response) {
                    var i = 0,
                        len,
                        data = response.data,
                        checkGeneratorDom;


                    if (data && data.length !== 0) {
                        data = data.floorList;
                        len = data.length;
                        // 第一次执行 生成DOM
                        checkGeneratorDom = footer.checkOnce(generatorDOM, that.once_floorDOM);
                        checkGeneratorDom();
                        that.once_floorDOM = true;

                        // 删除
                        that.me.swiper.removeAllSlides();
                        $('.floor-item span').remove();

                        $(data).each(function(i, item) {
                            if (item.floorNum === build) {
                                that.me.swiper.appendSlide(`<div class='swiper-slide'><img src='${data[i].floorImg}'></div>`);
                                $('.floor-item').append(`<span>${data[i].floorCode}</span>`);
                            }
                        });
                        // 默认选中 第一个
                        $('.floor-item span').first().addClass('selectedFloor');
                        // 添加点击 监听
                        $('.floor-item span').off('touchstart').on('touchstart', function() {
                            console.log($(this).index())
                            floor.me.swiper.slideTo($(this).index());
                            // 加载等待
                            var timer = setTimeout(function() {
                                footer.loadingRefresh(slide);
                                $('.floorList').hide();
                                floor.init_brand();
                                clearTimeout(timer);
                            }, 500)

                        })
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        init_brand: function(state, callback) {

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/brand')
                .then(function(response) {
                    var i = 0,
                        len,
                        data = response.data,
                        count = that.me.count,
                        buildCode = $('.selectedBuild').text(),
                        floorCode = $('.selectedFloor').text(),
                        wrapper = '#wrapper1',
                        array = [];

                    if (data && data.length !== 0) {
                        // 关闭等待页面
                        footer.closeLoadingRefresh();
                        // 有数据
                        data = data.floorBrand;

                        if (state !== 'pullUp') {
                            $(wrapper + ' ul').empty();
                        }

                        $.each(data, function(i, item) {
                            if (item.buildCode === buildCode && item.floorCode === floorCode) {
                                array.push(item);
                            }
                        });

                        len = array.length;
                        if (len === 0) {

                        }


                        for (; i < 5; i++) {
                            if (count < len) {
                                if (array[count].buildCode === buildCode && array[count].floorCode === floorCode) {
                                    $(wrapper + ' ul').append(` <li class='wrapper_item'>
                                            <div class='w_item_left'>
                                                <img src="${array[count].imgUrl}">
                                            </div>
                                            <div class='w_item_right'>
                                                <div class='w_item_right_top'>
                                                    <div class='introduction'>
                                                        <span class='brandName'>${array[count].brandName}</span>
                                                        <span class='formate'>(${array[count].formate})</span>
                                                        <i>${array[count].isFavorite === 0 ? '未关注' : '已关注'}</i>
                                                    </div>
                                                </div>
                                                <div class='w_item_right_bottom'>
                                                    <span>${array[count].active}</span>
                                                </div>
                                            </div>
                                        </li>`);
                                    that.me.count = count = ++count;
                                }
                            }
                        }
                        // 初始化IScroll;
                        if (!that.me.inited_scroll) {
                            floor.init_scroll();
                            that.me.inited_scroll = true;
                        } else {
                            setTimeout(function() {
                                refresher.me['#wrapper' + slideIndex].refresh();
                            }, 0);
                        }
                        // 数据加载完
                        if (count === len) {
                            refresher.me[wrapper].options.noData = true;
                        }
                    } else {
                        // 无数据
                    }
                })
                .catch(function(error) {
                    console.log(error);
                })
        },
        init_scroll: function() {
            refresher.init({
                id: '#wrapper' + slideIndex,
                pullDownAction: function() {
                    that.me.count = 0;
                    refresher.me['#wrapper' + slideIndex].options.noData = false;
                    floor.init_brand('pullDown')
                },
                pullUpAction: function() {
                    floor.init_brand('pullUp')
                },

            })
        }
    }
})();


// 业态
var formate = (function() {
    var that,
        slide,
        wrapper;

    return {
        me: {
            count: 0,
            inited_scroll: false
        },
        init: function() {
            that = this;
            wrapper = '#wrapper' + brand.swiper.activeIndex;
            slide = brand.swiper.slides[brand.swiper.activeIndex];

            // 执行一次 init
            if (!brand.me.inited_slide[brand.swiper.activeIndex]) {
                brand.me.inited_slide[brand.swiper.activeIndex] = true;
                // 插入DOM
                $(slide).append(`<div class='formateList'>
                                <div class='title'>请选择业态</div>
                            </div>`);
                // 关闭等待
                footer.closeLoadingRefresh();
                // 请求数据
                axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/brand')
                    .then(function(response) {
                        var i = 0,
                            len,
                            data = response.data;
                        if (data && data.length !== 0) {
                            data = data.formateType;
                            len = data.length;

                            // 插入
                            for (; i < len; i++) {
                                $('.formateList').append(`<span>${data[i].formateName}</span>`)
                            }
                            // 添加初始样式
                            $('.formateList span').first().addClass('selectedFormate');
                            // 添加点击事件
                            $('.formateList span').on('touchstart', function(e) {
                                $('.formateList span').removeClass('selectedFormate').eq($(this).index() - 1).addClass('selectedFormate');
                                footer.loadingRefresh(slide);
                                formate.init_brand();
                                $('.formateList').hide();
                            });
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                $('.formateList').show();
            }
        },
        init_brand: function(state) {
            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/brand')
                .then(function(response) {
                    var i = 0,
                        len,
                        data = response.data,
                        count = that.me.count,
                        array = [];

                    if (data && data.length !== 0) {
                        // 有数据
                        data = data.formate;

                        // 过滤数据
                        $.each(data, function(i, item) {
                            if (item.formate === $('.selectedFormate').text()) {
                                array.push(item);
                            }
                        });

                        len = array.length;

                        // 清空
                        if (state !== 'pullUp') {
                            count = that.me.count = 0;
                            $(wrapper + ' ul').empty();
                        }
                        // 插入
                        for (; i < 5; i++) {
                            if (count < len) {
                                $(wrapper + ' ul').append(` <li class='wrapper_item'>
                                            <div class='w_item_left'>
                                                <img src="${array[count].imgUrl}">
                                            </div>
                                            <div class='w_item_right'>
                                                <div class='w_item_right_top'>
                                                    <div class='introduction'>
                                                        <span class='brandName'>${array[count].brandName}</span>
                                                        <span class='formate'>(${array[count].formate})</span>
                                                        <i>${array[count].isFavorite === 0 ? '未关注' : '已关注'}</i>
                                                    </div>
                                                </div>
                                                <div class='w_item_right_bottom'>
                                                    <span>${array[count].active}</span>
                                                </div>
                                            </div>
                                        </li>`);
                                that.me.count = count = count + 1;
                            }
                        };
                        // 关闭等待
                        footer.closeLoadingRefresh();
                        // IScroll初始化 一次
                        if (!that.me.inited_scroll) {
                            that.me.inited_scroll = true;
                            formate.init_scroll();
                        }
                        // 没有更多数据
                        if (count === len) {
                            refresher.me[wrapper].options.noData = true;
                        }
                        // 刷新
                        if (refresher.me[wrapper]) {
                            var timer = setTimeout(function() {
                                refresher.me[wrapper].refresh();
                                clearTimeout(timer);
                            }, 0);
                        }

                    } else {
                        // 无数据
                    }
                })
                .catch(function(error) {
                    // 请求异常
                    console.log(error);
                })
        },
        init_scroll: function() {
            refresher.init({
                id: wrapper,
                pullDownAction: function() {
                    refresher.me[wrapper].options.noData = false;
                    formate.init_brand('pullDown');
                },
                pullUpAction: function() {
                    formate.init_brand();
                }
            })
        }
    }
})();