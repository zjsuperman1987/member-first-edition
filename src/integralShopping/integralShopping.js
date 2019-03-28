window.onload = function () {
	integral.init_data();
};


var integral = (function () {
	return {
		me: {
			count: 0,
		},
		init_data: function (state) {
			axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/integral')
					.then(function (resoponse) {
						console.log(refresher)
						var integralArr = resoponse.data.integral;
						if (!integralArr || integralArr.length === 0) return;
						if (state === 'pullDownAction') {
							integral.me.count = 0;
							$('.container').empty();
						}
						var i = 0, len = integralArr.length;
						for (; i < 5; i++) {
							if (integral.me.count < len) {
								var j = integral.me.count++,
									title = integralArr[j].title,
									company = integralArr[j].company,
									point = integralArr[j].integral,
									url = integralArr[j].imgUrl;

								company = '(' + company.slice(0,3) + '...';

								$('.container').append(`<div class='item'>
						                        <div class='top'>
						                            <span>${title}</span>
						                            <span>${company}</span>
						                        </div>
						                        <div class='middle'>
						                            <span>${point}</span>积分
						                        </div>
						                        <div class='bottom'>
						                            <img src=${url}>
						                        </div>
						                    </div>`)
							}
						}

						if (!state) {
							integral.init_scroll();
						}else{
							setTimeout(function () {
								refresher.spec['#wrapper'].refresh();
							}, 0)
						}



					})
					.catch(function (error) {
						console.log(error)
					})
		},
		init_scroll: function () {
			refresher.init({
				id: '#wrapper',
				pullDownAction: function () {
					integral.init_data('pullDownAction');
				},
				pullUpAction: function () {
					integral.init_data('pullUpAction');
				}
			});
		}
	}
})()