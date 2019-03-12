window.onload = function() {
    active.init_data();
}

var active = (function() {
    return {
        me: {
            dataCount: 0
        },
        init_data: function(state, callback) {

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/active')
                .then(function(response) {
                    console.log(response);
                    var data = response.data.active,
                        len = data.length,
                        dataCount = active.me.dataCount,
                        num = 3;
                    // 没有数据
                    if (!data && len === 0) {
                        refresher.spec['#wrapper'].options.no_more_data = true;
                        callback();
                        return;
                    }
                    if (state === 'pullDownAction') {
                        dataCount = active.me.dataCount = 0;
                        refresher.spec['#wrapper'].options.no_more_data = false;
                        $('#wrapper li').empty();
                    }
                    for (var i = 0; i < num; i++) {
                        if (dataCount < len) {
                            $('#wrapper ul li').append(`<dir class='active_wrapper'>
                                                  <img src=${data[dataCount].imgUrl}>
                                                  <div class='aw_top'>
                                                      <span>${data[dataCount].activeTitle}</span>
                                                      <span>${data[dataCount].activeType}</span>
                                                  </div>
                                                  <div class='aw_bottom'>
                                                      <span>${data[dataCount].startDate}~${data[dataCount].endDate}</span>
                                                      <span>${data[dataCount].activeState}</span>
                                                  </div>
                                              </dir>`);
                            dataCount++;
                            active.me.dataCount++;
                        } else {
                            refresher.spec['#wrapper'].options.no_more_data = true;
                        }
                    }

                    if (state) {
                        callback();
                    } else {
                        active.init_scroller();
                    }
                    active.init_tap();
                })
                .catch(function(error) {
                    refresher.spec['#wrapper'].options.net_error = true;
                    console.log(error);
                });
        },
        init_scroller: function() {
            refresher.init({
                id: '#wrapper',
                pullDownAction: function() {
                    active.init_data('pullDownAction', refresh);
                },
                pullUpAction: function() {
                    active.init_data('pullUpAction', refresh);
                }
            });

            function refresh() {
                setTimeout(function() {
                    refresher.spec['#wrapper'].refresh();
                }, 0);
            }


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
        dataCount: 0,
        preText: '',
        // 初始化页面
        init_search_page: function() {
            // 展示历史搜索
            if (localStorage.getItem('history')) {

                var json_string = localStorage.getItem('history'),
                    array = JSON.parse(json_string);
                len = array.length;

                $('.history_content').empty();
                for (var i = 0; i < len; i++) {
                    $('.history_content').append(`<span>${array[i]}</span>`)
                }
            }

            var firstTime = setTimeout(function() {
                $('.as_middle').css('padding', '0 1.333333rem');
                clearTimeout(firstTime)
            }, 0);
            var seconde = setTimeout(function() {
                $('.as_left, .as_right').show();
                clearTimeout(seconde)
            }, 500);
            $('.container').show();

            active_search.search_page_click();
        },
        // 点击搜索
        search_page_click: function() {
            $('.as_right, .history_content span, .hot_search span, input[type=text], .as_left, .history_top_right').off('click').on('click', function(e) {
                // 返回
                if (this.className === 'as_left') {
                    if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
                    $('.active_search_page').hide();
                    $('.bottom_page').show();
                    $('.no_search').remove();
                    $('.as_middle').css('padding', '0');
                    $('input[type=text]').val('');
                    $('.as_left, .as_right').hide();
                }
                // 移除
                if (this.className === 'history_top_right') {
                    localStorage.removeItem('history');
                    $('.history_content').empty();
                }
                // 搜索框
                if (this.tagName === 'INPUT') {
                    $('.container').show();
                    if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
                    $('input[type=text]').val('');
                    $('.no_search').remove();
                    return;
                }
                // 热门标签
                if (this.tagName === 'SPAN') {
                    $('input[type=text]').val($(this).text());
                }
                // 搜索框无内容 
                if (!$('input[type=text]').val()) return;



                active_search.search($('input[type=text]').val());
            })
        },
        search: function(text, state, callback) {
            var regexp = new RegExp(text, 'g');
            var that = this;
            this.dataCount = 0;
            // if(this.preText && this.preText === text && state != 'pullDown') return;
            // this.preText = text;

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/active')
                .then(function(response) {
                    var data = response.data.active;
                    var len = data.length;
                    // 没有数据
                    if (!data || len === 0) {
                        $('.no_search').remove();
                        var no_search = $('<div>');
                        no_search.addClass('no_search').text('抱歉,没有找到你要的内容...换个别的');
                        $('.active_search_page').append(no_search);
                        if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
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
                    // 没有数据
                    if (that.search_data.length === 0) {
                        $('.no_search').remove();
                        var no_search = $('<div>');
                        no_search.addClass('no_search').text('抱歉,没有找到你要的内容...换个别的');
                        $('.active_search_page').append(no_search);
                        if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
                        return;
                    }


                    if (!state) {
                        active_search.update_search_page();
                    } else {
                        active_search.update_search_page(state, callback);
                    }

                })
                .catch(function(error) {
                    refresher.spec['#wrapper'].options.net_error = true;
                    console.log(error);
                });
        },

        update_search_page: function(state, callback) {

            var that = this,
                data = this.search_data,
                len = data.length;

            if (state === 'pullDown') {
                refresher.spec['#spScrollerWrapper'].options.no_more_data = false;
                $('#spScrollerWrapper li').empty();
                this.dataCount = 0;
                inserting_scroller();
                callback();
            } else if (state === 'pullUp') {
                inserting_scroller();
                if (len === that.dataCount) {
                    refresher.spec['#spScrollerWrapper'].options.no_more_data = true;
                }
                callback();
            } else {
                var div = document.createElement('div'),
                    ul = document.createElement('ul'),
                    li = document.createElement('li');

                if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
                div.id = 'spScrollerWrapper';
                ul.appendChild(li);
                div.appendChild(ul);
                div.style.display = 'block';
                $('.active_search_page').append(div);
                $('.container').hide();

                inserting_scroller();
                this.init_search_scroller();
                // 更新历史搜索记录
                active_search.history_record();
            }


            function inserting_scroller() {
                $('.no_search').remove();
                for (var i = 0; i < 3; i++) {
                    if (that.dataCount < len) {
                        var dataCount;
                        dataCount = that.dataCount++;
                        $('#spScrollerWrapper li').append(`<dir class='active_wrapper'>
                                                  <img src=${data[dataCount].imgUrl}>
                                                  <div class='aw_top'>
                                                      <span>${data[dataCount].activeTitle}</span>
                                                      <span>${data[dataCount].activeType}</span>
                                                  </div>
                                                  <div class='aw_bottom'>
                                                      <span>${data[dataCount].startDate}~${data[dataCount].endDate}</span>
                                                      <span>${data[dataCount].activeState}</span>
                                                  </div>
                                              </dir>`);
                    }
                }
            }
        },
        init_search_scroller: function() {
            var that = this;

            refresher.init({
                id: "#spScrollerWrapper",
                pullDownAction: function() {
                    that.search($('input[type=text]').val(), 'pullDown', refresh);
                },
                pullUpAction: function() {
                    that.update_search_page('pullUp', refresh);
                }
            });
            function refresh () {
                setTimeout(function () {
                    refresher.spec['#spScrollerWrapper'].refresh();
                },0)
            }

        },
        history_record: function() {
            if (!localStorage.getItem('history')) {
                var array = [];
                array.push($('input[type=text]').val());
                var json = JSON.stringify(array);
                localStorage.setItem('history', json);
            } else {
                var json_string = localStorage.getItem('history'),
                    array = JSON.parse(json_string);
                text = $('input[type=text]').val();
                if (array.indexOf(text) != -1) return;
                if (array.length === 10) array.pop();
                array.unshift(text);
                localStorage.setItem('history', JSON.stringify(array));
            }
        }
    }
}());