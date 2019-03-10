window.onload = function () {
	member_welfare.init_scroller();
}


var member_welfare = (function(){
	return {
		init_scroller: function () {
			refresher.init({
				id: '#wrapper'
				// pullDownAction: function () {
				// 	refresher.spec['#wrapper'].refresh();
				// }
			})
		}		
	}
})()