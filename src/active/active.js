window.onload = function () {
	active.init_scroller();
}

var active = (function (){
	return {
		init_data: function () {

		},
		init_scroller: function () {
			refresher.init({
				id: '#wrapper'
			})
		}
	}
}());