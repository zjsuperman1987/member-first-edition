window.onload = function() {
    footer.init();
    memberHome.initSwiper();
    memberHome.init_welfare_data();
    memberHome.initSkip();
};


memberHome = (function() {
    return {
        globSpec: {
            welfareCount: 0
        },
        initSwiper: function() {
            // 头部轮播
            var headerSwiper = new Swiper('.swiper-container-header', {
                autoplay: true,
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
        init_welfare_data: function(state) {
            axios.get('https://www.easy-mock.com/mock/5c77f974ee24c36460daaffb/example/index_data')
                .then(function(response) {
                    var melfareData = response.data && response.data.melfareData
                    if (melfareData && melfareData.length != 0) {
                        var len = melfareData.length;
                        if (state === 'pullDown') {
                            $('.welfare_wrapper').empty();
                            memberHome.globSpec.welfareCount = 0;
                            refresher.spec['#glob_wrapper_iscroll'].options.updateContent = false;
                        };
                        for (var i = 0; i < 3; i++) {
                            if (memberHome.globSpec.welfareCount < len) {
                                memberHome.globSpec.welfareCount++;
                                $('.welfare_wrapper').append("<div class='welfare_wrapper_content'>" +
                                    "<div class='welfare_item'>" +
                                    "<i class='cro_left_top'></i>" +
                                    "<i class='cro_right_top'></i>" +
                                    "<i class='cro_left_bottom'></i>" +
                                    "<i class='cro_right_bottom'></i>" +
                                    "<div class='welfare_item_left'>" +
                                    "<span class='welfare_item_left_icon'><i>" + melfareData[i].floor + "</i></span>" +
                                    "<span class='welfare_item_left_font'>" + melfareData[i].melfareAmount + "元" + melfareData[i].melfareType + "</span>" +
                                    "</div>" +
                                    "<div class='welfare_item_right'>" +
                                    "<div class='welfare_item_right_title'>" + melfareData[i].company + melfareData[i].melfareAmount + "元" + melfareData[i].melfareType + "</div>" +
                                    "<div class='welfare_item_right_top'>" + melfareData[i].company + melfareData[i].melfareAmount + "元" + melfareData[i].melfareType + "</div>" +
                                    "<div class='welfare_item_right_middle'>" + melfareData[i].mall + "</div>" +
                                    "<div class='welfare_item_right_bottom'>" +
                                    "<span class='nowPrice'>￥" + melfareData[i].currentAmount + "</span>" +
                                    "<span class='oldPrice'>￥" + melfareData[i].melfareAmount + "</span>" +
                                    "<span class='buy'>购买</span>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>" +
                                    "</div>")
                            }
                            if (memberHome.globSpec.welfareCount === len) {
                                refresher.spec['#glob_wrapper_iscroll'].options.updateContent = true;
                            }
                        }

                        if (!state) {
                            memberHome.init_iscroll();
                        } else if (state === 'pullUp') {
                            setTimeout(function() {
                                refresher.spec['#glob_wrapper_iscroll'].refresh();
                            }, 0);
                        } else {
                            var wrapper = refresher.spec['#glob_wrapper_iscroll'];
                            wrapper.scroller = document.querySelector('#glob_wrapper_iscroll').querySelector('.scroller');
                            setTimeout(function() {
                                refresher.spec['#glob_wrapper_iscroll'].refresh();
                            }, 0);
                        }

                    }
                })
                .catch(function(error) {


                    console.log(error);
                });
        },
        init_iscroll: function() {

            refresher.init({
                id: '#glob_wrapper_iscroll',
                pullDownAction: function() {
                    memberHome.init_welfare_data("pullDown");
                },
                pullUpAction: function() {
                    memberHome.init_welfare_data('pullUp');
                }
            });

            refresher.spec['#glob_wrapper_iscroll'].on('beforeScrollStart', function() {
                memberHome.globSpec.tap = true;
                console.log('beforeScrollStart')
            })

            refresher.spec['#glob_wrapper_iscroll'].on('scroll', function() {
                memberHome.globSpec.tap = !(memberHome.globSpec.tap);
            })
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
                        break;
                    case 'wifi':
                        break;
                    case '停车':
                        break;
                    case '预约':
                        break;
                    case '积分':
                        break;
                    case '抽奖':
                        break;
                    case '游戏':
                        break;
                    default:
                        break;
                }
            });
        }
    }
})();