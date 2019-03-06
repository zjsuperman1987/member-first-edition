window.onload = function () {
	active_search.init_page();
	active_search.init_scroller();
	active_search.init_click();
}


var active_search = (function () {
	return {
		init_page: function () {
			// 光标聚焦
			$('input[type=text]').focus();
			// 初始化历史搜索

		},
		init_scroller: function () {

		},
		init_click: function () {
			$('.as_right').on('click', function() {
				var text = $.trim($('input[type=text]').val());
				if (!text) return;

				axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/active')
                .then(function(response) {
                	console.log(response);
                	var data = 	response.data.active;
                	var regexp = new RegExp(text,"g");
                	console.log(regexp);
                	for (var i = 0; i < data.length; i++) {
                		 var b = data[i].activeType.match(regexp);
                		 var a = data[i].activeTitle.match(regexp);
                		 if (a || b) {
                		 		alert(999)
                		 	 if (!wrapper) {
                		 	 	var wrapper = $('<div>');
                		 	 	wrapper.id = 'wrapper';
                		 	 	var ul = $('<ul>');
                		 	 	var li = $('<li>');
                		 	 	$(ul).append(li);
                		 	 	$(wrapper).append(ul);
                		 	 	wrapper.addClass(wrapper_scroller);
                		 	 	$(wrapper).find('li').append(`<dir class='active_wrapper'>
												      <img src=${data[i].imgUrl}>
												      <div class='aw_top'>
												          <span>${data[i].activeTitle}</span>
												          <span>${data[i].activeType}</span>
												      </div>
												      <div class='aw_bottom'>
												          <span>${data[i].startDate}~${data[i].endDate}</span>
												          <span>${data[i].activeState}</span>
												      </div>
												  </dir>`);
                		 	 }else {
                		 	 	$(wrapper).find('li').append(`<dir class='active_wrapper'>
												      <img src=${data[i].imgUrl}>
												      <div class='aw_top'>
												          <span>${data[i].activeTitle}</span>
												          <span>${data[i].activeType}</span>
												      </div>
												      <div class='aw_bottom'>
												          <span>${data[i].startDate}~${data[i].endDate}</span>
												          <span>${data[i].activeState}</span>
												      </div>
												  </dir>`);
                		 	 }

                		 }
                	}

                	if (wrapper) {
                		new IScroll("#wrapper");
                	}

 
                })
                .catch(function(error) {
                    console.log(error);
                });


 
			})

			
		}
	}		
}());