window.onload = function() {
    footer.init();
    mine.init_click();
}

var mine = (function() {
    return {
        init_click: function() {
            $('.container_item').on('click', function() {
                var text = $(this).find('span').text();
                switch (text) {
                    case '兑换记录':
                        break;
                    case '消费记录':
                        break;
                    case '签到记录':
                        break;
                    case '我的卡券':
                        break;
                    case '我的礼品':
                        break;
                    case '会员福利':
                    	window.location.href = '../member_welfare/member_welfare.html'
                        break;
                    case '投诉建议':
                        break;
                    case '推荐有奖':
                        break;
                    case '关注商家':
                        break;
                    default:
                    	break;
                }
            })
        }
    }
})()