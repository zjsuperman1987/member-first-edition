window.onload = function() {
    active.init_data('init');
}

var active = (function() {
    return {
        spec: {
            activeCount: 0
        },
        init_data: function(state) {

            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/active')
                .then(function(response) {
                    console.log(response);
                    // debugger;
                    // 下拉刷新 清空数据
                    if (state === 'pullDown') {
                        refresher.spec['#wrapper'].options.updateContent = false;
                        active.spec.activeCount = 0;
                        $('#wrapper ul li').empty();
                    }
                    if (response.data.active && response.data.active.length != 0) {
                        data = response.data.active,
                            len = data.length;
                        for (var i = 0; i < 3; i++) {
                            var activeCount = active.spec.activeCount;
                            if (activeCount < len) {
                                $('#wrapper ul li').append(`<dir class='active_wrapper'>
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
                                active.spec.activeCount++;
                            }
                        }

                        if (state === 'init') {
                            active.init_scroller();

                        } else if (state === 'pullUp') {
                            if (activeCount === len) {
                                refresher.spec['#wrapper'].options.updateContent = true;
                            }
                            setTimeout(function() {
                                refresher.spec['#wrapper'].refresh();
                            }, 0);
                        } else {
                            refresher.spec['#wrapper'].scroller = document.querySelector('#wrapper').querySelector('.scroller');
                            setTimeout(function() {
                                refresher.spec['#wrapper'].refresh();
                            }, 0);
                        }
                    }
                    active.init_tap();
                })
                .catch(function(error) {
                    console.log(error);
                });
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
                 if (this.className === 'as_left'){
                    if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
                    $('.active_search_page').hide();
                    $('.bottom_page').show();
                    $('.no_search').remove();
                    $('.as_middle').css('padding', '0');
                    $('input[type=text]').val('');
                    $('.as_left, .as_right').hide();
                    console.log('1232132132131231')

                }
                if (this.className === 'history_top_right'){
                    localStorage.removeItem('history');
                    $('.history_content').empty();
                }



                if (this.tagName === 'INPUT') {
                    $('.container').show();
                    if ($('#spScrollerWrapper')) $('#spScrollerWrapper').remove();
                    $('input[type=text]').val('');
                    $('.no_search').remove();
                    return;
                }
                
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
            this.activeCount = 0;
            // if(this.preText && this.preText === text && state != 'pullDown') return;
            // this.preText = text;
            
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
                // this.activeCount = 0;
                inserting_scroller();
                // 请求数据异步 所以这里执行刷新方法
                setTimeout(function(){
                    refresher.spec['#spScrollerWrapper'].refresh();
                },0);
            } else if (state === 'pullUp') {
                inserting_scroller();
                if (len === that.activeCount) {
                    refresher.spec['#spScrollerWrapper'].options.updateContent = true;
                }
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

            
            function inserting_scroller () {
                $('.no_search').remove();
                for (var i = 0; i < 3; i++) {
                    if (that.activeCount < len) {
                        var activeCount;
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
                   
                },
                pullUpAction: function() {
                    // debugger;
                    that.update_search_page('pullUp');
                    setTimeout(function(){
                        refresher.spec['#spScrollerWrapper'].refresh();
                    },0);
                }
            })   
        },
        history_record: function () {
            if (!localStorage.getItem('history')) {
                var array = [];
                array.push($('input[type=text]').val());
                var json = JSON.stringify(array);
                localStorage.setItem('history',json);
            }else {
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