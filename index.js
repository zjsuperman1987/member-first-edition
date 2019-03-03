window.onload = function() {
    memberHome.initSwiper();
    memberHome.init_iscroll();
}


memberHome = (function() {
    return {
        globSpec: {},
        initSwiper: function() {
            var headerSwiper = new Swiper('.swiper-container-header', {
                autoplay: true,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                },
            })
            axios.get('https://www.easy-mock.com/mock/5c77f974ee24c36460daaffb/example/index_data')
                .then(function(response) {
            		len = response.data.headerCarouse.length
                    if (response.data.headerCarouse && len != 0) {
                    	for (var i = 0; i < len; i++) {
                    		headerSwiper.appendSlide('<div class="swiper-slide"><img src="' + response.data.headerCarouse[i].imgUrl + '"></div>');
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
                    refresher.spec['#glob_wrapper_iscroll'].refresh();
                },
                pullUpAction: function() {
                    refresher.spec['#glob_wrapper_iscroll'].refresh();
                }
            });
        }
    }
})();