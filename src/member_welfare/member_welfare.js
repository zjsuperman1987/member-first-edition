window.onload = function() {
    member_welfare.init_data();
    
}


var member_welfare = (function() {
    return {
        me: {
            dataCount: 0
        },
        init_data: function(state, callback) {
            axios.get('https://www.easy-mock.com/mock/5c77f974ee24c36460daaffb/example/member_welfare')
                .then(function(response) {
                    var data = response.data.member_welfare,
                        len = data.length,
                        dataCount = member_welfare.me.dataCount,
                        num = 10;

                    if (!data && len === 0) {
                        refresher.spec['#wrapper'].options.no_more_data = true;
                        callback();
                        return;
                    }
                    if (!state) {
                        num = 5;
                        member_welfare.init_scroller();
                    }
                    if (state === 'pullDownAction') {
                        dataCount = member_welfare.me.dataCount = 0;
                        refresher.spec['#wrapper'].options.no_more_data = false;
                        $('#wrapper li').empty();
                    }
                    if (state === 'pullUpAction') {

                    }

                    for (var i = 0; i < num; i++) {
                        if (dataCount < len) {
                            $('#wrapper li').append(`<div class='item'>
                                                    <div class='item_left'>
                                                        <span>${data[dataCount].name}</span>
                                                    </div>
                                                    <div class='item_right'>
                                                        折扣: <span>${data[dataCount].discount}</span> 折
                                                    </div>
                                                </div>`);
                            dataCount++;
                            member_welfare.me.dataCount++;
                        } else {
                            refresher.spec['#wrapper'].options.no_more_data = true;
                        }
                    }

                    if (state) {
                        callback();
                    }

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
                    member_welfare.init_data('pullDownAction', function() {
                        setTimeout(function() {
                            refresher.spec['#wrapper'].refresh();
                        }, 0)
                    });
                },
                pullUpAction: function() {
                    member_welfare.init_data('pullUpAction', function() {
                        setTimeout(function() {
                            refresher.spec['#wrapper'].refresh();
                        }, 0)
                    });
                }
            })
        }
    }
})()