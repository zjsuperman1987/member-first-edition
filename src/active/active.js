window.onload = function() {
    active.init_data('init');
    active.init_tap();
}

var active = (function() {
    return {
        spec: {
            activeCount: 0
        },
        init_data: function(state) {

            // axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/active')
            //     .then(function(response) {
            //         console.log(response);
            //         // debugger;
            //         // 下拉刷新 清空数据
            //         if (state === 'pullDown') {
            //             refresher.spec['#wrapper'].options.updateContent = false;
            //             active.spec.activeCount = 0;
            //             $('#wrapper ul li').empty();
            //         }
            //         if (response.data.active && response.data.active.length != 0) {
            //             data = response.data.active,
            //                 len = data.length;
            //             for (var i = 0; i < 3; i++) {
            //                 var activeCount = active.spec.activeCount;
            //                 if (activeCount < len) {
            //                     $('#wrapper ul li').append(`<dir class='active_wrapper'>
            //                                       <img src=${data[activeCount].imgUrl}>
            //                                       <div class='aw_top'>
            //                                           <span>${data[activeCount].activeTitle}</span>
            //                                           <span>${data[activeCount].activeType}</span>
            //                                       </div>
            //                                       <div class='aw_bottom'>
            //                                           <span>${data[activeCount].startDate}~${data[activeCount].endDate}</span>
            //                                           <span>${data[activeCount].activeState}</span>
            //                                       </div>
            //                                   </dir>`);
            //                     active.spec.activeCount++;
            //                 }
            //             }

            //             if (state === 'init') {
            //                 active.init_scroller();

            //             } else if (state === 'pullUp') {
            //                 if (activeCount === len) {
            //                     refresher.spec['#wrapper'].options.updateContent = true;
            //                 }
            //                 setTimeout(function() {
            //                     refresher.spec['#wrapper'].refresh();
            //                 }, 0);
            //             } else {
            //                 refresher.spec['#wrapper'].scroller = document.querySelector('#wrapper').querySelector('.scroller');
            //                 setTimeout(function() {
            //                     refresher.spec['#wrapper'].refresh();
            //                 }, 0);
            //             }
            //         }
            //         active.init_tap();
            //     })
            //     .catch(function(error) {
            //         console.log(error);
            //     });
        },
        init_scroller: function() {
            refresher.init({
                id: '#wrapper',
                pullDownAction: function() {
                    active.init_data('pullDown');
                },
                pullUpAction: function() {
                    active.init_data('pullUp');
                }
            });


            refresher.spec['#wrapper'].on('beforeScrollStart', function() {
                active.spec.tap = true;
            })

            refresher.spec['#wrapper'].on('scroll', function() {
                active.spec.tap = !(active.spec.tap);
            })

        },
        init_tap: function() {
            // 点击搜索栏
            $('.header').on('click', function(e) {
                // window.location.href = './activeSearch/activeSearch.html'
                $('.bottom_page').hide();
                $('.active_search_page').show();
                active_search.init_search_page();
            });
            //点击活动
            $('.active_wrapper').off('tap').on('tap', function() {
                console.log(active.spec.tap, '=================================')
                if (active.spec.tap) {
                    alert(999)
                }
            });
        }
    }
}());


//  ====================================搜索页======================================
var active_search = (function() {
    return {
        // 初始化
        search_data: [],
        activeCount: 0,

        init_search_page: function() {


            var firstTime = setTimeout(function() {
                $('.as_middle').css('padding', '0 1.333333rem');
                clearTimeout(firstTime)
            }, 0);
            var seconde = setTimeout(function() {
                $('.as_left, .as_right').show();
                clearTimeout(seconde)
            }, 500);

            active_search.search_page_click();
        },
        // 点击搜索
        search_page_click: function() {
            $('.as_right, .history_content span, .hot_search span').on('click', function() {
                if (this.tagName === 'SPAN') {
                    $('input[type=text]').val($(this).text());
                }
                if (!$('input[type=text]').val()) return;
                active_search.search($('input[type=text]').val());
            })
        },
        search: function(text, state) {
            var regexp = new RegExp(text, 'g');
            var that = this;

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/active')
                .then(function(response) {
                    var data = response.data.active;
                    var len = data.length;
                    // 没有找到
                    if (!data || len === 0) {
                        $('.no_search').remove();
                        var no_search = $('<div>');
                        no_search.addClass('no_search').text('抱歉,没有找到你要的内容...换个别的');
                        $('.active_search_page').append(no_search);
                        return;
                    }
                    that.search_data = [];
                    for (var i = 0; i < len; i++) {
                        var had_active_type = regexp.test(data[i].activeType);
                        regexp.lastIndex = 0;
                        var had_active_title = regexp.test(data[i].activeTitle);
                        if (had_active_type || had_active_title) {
                            that.search_data.push(data[i]);
                        }
                    }
                    if (!state) {
                        active_search.update_search_page();    
                    }else {
                        active_search.update_search_page(state);
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                });
        },

        update_search_page: function(state) {
            var that = this;
                data = this.search_data,
                len = data.length;
            
            if (state === 'pullDown') {
                $('#spScrollerWrapper li').empty();
                this.activeCount = 0;
                inserting_scroller();
            } else if (state === 'pullUp') {
                inserting_scroller();
                if ((len - that.activeCount) === 1) {
                    refresher.spec['#spScrollerWrapper'].options.updateContent = true;
                }
            } else {
                var div = document.createElement('div'),
                    ul = document.createElement('ul'),
                    li = document.createElement('li');
                   

                div.id = 'spScrollerWrapper';
                ul.appendChild(li);
                div.appendChild(ul);
                div.style.display = 'block';
                $('.active_search_page').append(div);
                $('.container').hide();

                inserting_scroller();
                this.init_search_scroller();
               
            }

            
            function inserting_scroller () {
                for (var i = 0; i < 3; i++) {
                    if (that.activeCount < len) {
                        var activeCount;
                        if ((len - that.activeCount ) === 1) return;
                        
                        activeCount = that.activeCount ++;
                        $('#spScrollerWrapper li').append(`<dir class='active_wrapper'>
                                                  <img src=${data[activeCount].imgUrl}>
                                                  <div class='aw_top'>
                                                      <span>${data[activeCount].activeTitle}</span>
                                                      <span>${data[activeCount].activeType}</span>
                                                  </div>
                                                  <div class='aw_bottom'>
                                                      <span>${data[activeCount].startDate}~${data[activeCount].endDate}</span>
                                                      <span>${data[activeCount].activeState}</span>
                                                  </div>
                                              </dir>`);
                    }
                }
            }
        },
        init_search_scroller: function(){
            var that = this;
            refresher.init({
                id: "#spScrollerWrapper",
                pullDownAction: function(){
                    that.search($('input[type=text]').val(), 'pullDown');
                    refresher.spec['#spScrollerWrapper'].options.updateContent = false;
                    refresher.spec['#spScrollerWrapper'].refresh();
                },
                pullUpAction: function() {
                    debugger;
                    that.update_search_page('pullUp');
                    refresher.spec['#spScrollerWrapper'].refresh();
                }
            })   
        }


    }
}());