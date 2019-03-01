window.onload = function() {
	memberHome.init_iscroll();
}


memberHome = (function() {
    return {
    	globSpec: {},
    	init_iscroll: function () {
			refresh.init('#glob_wrapper_iscroll');
    	}
    }
})();