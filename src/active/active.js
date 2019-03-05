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
                            setTimeout(function () {
						        refresher.spec['#wrapper'].refresh();
						    }, 100);
                        } else {
                            refresher.spec['#wrapper'].scroller = document.querySelector('#wrapper').querySelector('.scroller');
                            setTimeout(function () {
						        refresher.spec['#wrapper'].refresh();
						    }, 100);
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
            	console.log('beforeScrollStart')
            })
         
            refresher.spec['#wrapper'].on('scroll', function() {
            	
            	active.spec.tap = !(active.spec.tap);
            })

        },
        init_tap: function () {
        	$('.active_wrapper').off('tap').on('tap', function () {
        		console.log(active.spec.tap,'=================================')
        		if (active.spec.tap) {
        			
        		}
        	})
        }
    }
}());