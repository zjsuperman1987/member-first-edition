window.onload = function() {
    footer.init();
    memberHome.initSwiper();
    memberHome.init_welfare_data();
    memberHome.initSkip();
};


memberHome = (function() {
    return {
        me: {
            dataCount: 0
        },
        initSwiper: function() {
            // 头部轮播
            var headerSwiper = new Swiper('.swiper-container-header', {
                autoplay: {
                    disableOnInteraction: false
                },
                loop: true,
                pagination: {
                    el: '.swiper-pagination'
                }
            });

            axios.get('https://www.easy-mock.com/mock/5c77f974ee24c36460daaffb/example/index_data')
                .then(function(response) {
                    console.log(response);
                    if (response.data.headerCarouse && response.data.headerCarouse.length != 0) {
                        len = response.data.headerCarouse.length;
                        for (var i = 0; i < len; i++) {
                            headerSwiper.appendSlide('<div class="swiper-slide"><img src="' + response.data.headerCarouse[i].imgUrl + '"></div>');
                        }
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            // 导航轮播
            var navSwiper = new Swiper('.swiper-container-nav', {
                autoplay: false,
                touchMoveStopPropagation: false
            })
        },
        init_welfare_data: function(state, callback) {
            axios.get('https://www.easy-mock.com/mock/5c77f974ee24c36460daaffb/example/index_data')
                .then(function(response) {
                    var data = response.data && response.data.welfareData,
                        len = data.length,
                        dataCount = memberHome.me.dataCount,
                        num = 3;

                    if (!data && len === 0) {
                        refresher.spec['#wrapper'].options.no_more_data = true;
                        callback();
                        return;
                    }
                    if (state === 'pullDownAction') {
                        dataCount = memberHome.me.dataCount = 0;
                        refresher.spec['#wrapper'].options.no_more_data = false;
                        $('.welfare_wrapper').empty();
                    }
 
                    for (var i = 0; i < num; i++) {
                        if (dataCount < len) {
                            $('.welfare_wrapper').append("<div class='welfare_wrapper_content'>" +
                                "<div class='welfare_item'>" +
                                "<i class='cro_left_top'></i>" +
                                "<i class='cro_right_top'></i>" +
                                "<i class='cro_left_bottom'></i>" +
                                "<i class='cro_right_bottom'></i>" +
                                "<div class='welfare_item_left'>" +
                                "<span class='welfare_item_left_icon'><i>" + data[i].floor + "</i></span>" +
                                "<span class='welfare_item_left_font'>" + data[i].melfareAmount + "元" + data[i].melfareType + "</span>" +
                                "</div>" +
                                "<div class='welfare_item_right'>" +
                                "<div class='welfare_item_right_title'>" + data[i].company + data[i].melfareAmount + "元" + data[i].melfareType + "</div>" +
                                "<div class='welfare_item_right_top'>" + data[i].company + data[i].melfareAmount + "元" + data[i].melfareType + "</div>" +
                                "<div class='welfare_item_right_middle'>" + data[i].mall + "</div>" +
                                "<div class='welfare_item_right_bottom'>" +
                                "<span class='nowPrice'>￥" + data[i].currentAmount + "</span>" +
                                "<span class='oldPrice'>￥" + data[i].melfareAmount + "</span>" +
                                "<span class='buy'>购买</span>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>");

                            dataCount++;
                            memberHome.me.dataCount++;
                        } else {
                            refresher.spec['#wrapper'].options.no_more_data = true;
                        }
                    }

                    if (state) {
                        callback();
                    }else {
                        memberHome.init_iscroll();
                    }
                })
                .catch(function(error) {
                    refresher.spec['#wrapper'].options.net_error = true;
                    console.log(error);
                });
        },
        init_iscroll: function() {
            refresher.init({
                id: '#wrapper',
                pullDownAction: function() {
                    memberHome.init_welfare_data('pullDownAction', refresh);
                },
                pullUpAction: function() {
                    memberHome.init_welfare_data('pullUpAction', refresh);
                }
            });

            function refresh() {
                setTimeout(function() {
                    refresher.spec['#wrapper'].refresh();
                }, 0)
            }
        },
        // 页面跳转
        initSkip: function() {
            $('.swiper-container-nav .swiper-slide-item').on('tap', function(e) {
                while (!$(e.target).hasClass("swiper-slide-item")) {
                    e.target = $(e.target).parent();
                }
                var text = $(e.target).find('span').text();
                switch (text) {
                    case '活动':
                        window.location.href = './src/active/active.html';
                        break;
                    case '品牌':
                        window.location.href = './src/brand/brand.html';
                        break;
                    case 'wifi':
                        break;
                    case '停车':
                        break;
                    case '预约':
                        break;
                    case '积分':
                        window.location.href = './src/integralShopping/integralShopping.html'
                        break;
                    case '抽奖':
                        window.location.href = './src/lottery/lottery.html'
                        break;
                    case '游戏':
                        window.location.href = './src/roulette_game/roulette.html';
                        break;
                    default:
                        break;
                }
            });
        }
    }
})();