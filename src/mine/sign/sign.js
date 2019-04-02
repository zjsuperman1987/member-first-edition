// 参数fmt必须
// date参数不必须，允许字符串和时间对象，不传或者传无法转换成合法时间对象的字符串则默认当前时间,
// 年(YYYY/yyyy)固定四个占位符
// 月(M)、日(d)、小时(h)、分(m)、秒(s)可以用 1-2个占位符,严格区分大小写，
// 毫秒（ms/mss）最多三个占位符，分别对应56，056这种类型
// 例子：
// (Format("yyyy-MM-dd hh:mm:ss:ms") ==> 2006-07-02 08:09:04:23
// (Format("yyyy-MM-dd hh:mm:ss:mss") ==> 2006-07-02 08:09:04:023
// (Format("yyyy-M-d h:m:s:ms")      ==> 2006-7-2 8:9:4.180
function formate(fmt, date) {
    _date = new Date(date).toString() === 'Invalid Date' ? new Date() : new Date(date);
    var _rules = [{
        rule: '[yY]{4}',
        value: _date.getFullYear()
    }, {
        rule: 'M+',
        value: _date.getMonth() + 1
    }, {
        rule: '[dD]+',
        value: _date.getDate()
    }, {
        rule: 'h+',
        value: _date.getHours()
    }, {
        rule: 'm+',
        value: _date.getMinutes()
    }, {
        rule: 's+',
        value: _date.getSeconds()
    }, {
        rule: 'ms{1,2}',
        value: _date.getMilliseconds()
    }];

    _rules.forEach(function(_r) {
        const rule = _r.rule,
            val = _r.value;
        fmt = fmt.replace(new RegExp(rule), function($1) {
            const rLen = val.toString().length,
                fLen = $1.length;
            return (fLen !== 2 || rLen >= fLen) ? val : ['00', val].join('').substr(rLen);
        });
    });
    return fmt;
}
// //调用：
// var time1 = formate("YYYY/MM/DD hh:mm:ss", new Date()); //2017/11/2 11:09:20
// var time2 = formate("YYYY-MM-DD", time1); //2017-11-2
// var time3 = formate("MM-DD-YYYY", time2); //11-2-2017




const WEEKTABLE = [{
    cn: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    cns: ['日', '一', '二', '三', '四', '五', '六'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}, {
    cn: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    cns: ['一', '二', '三', '四', '五', '六', '日'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}]



var calendar = (function() {
    return {
        init: function() {
            var signDate,
            	time = formate("YYYY-MM-DD"),
                year = time.split('-')[0],
                month = time.split('-')[1],
                day = time.split('-')[2],
                dayArray = this.getMonthDaysArray(year, month, day, 0);
                signArray = [1];

            // 计算累计天数
            function howDate() {
	        	 // 累计签到
	        	document.querySelector('.grand-sign span').innerHTML = document.querySelectorAll('.sign-date').length;
            }

            

        	dayArray.forEach(function (item) {
        		var span = document.createElement('span'),
        			text = document.createTextNode(item.dayNum);
        			span.appendChild(text);

    			if (item.isThisMonth) span.className = 'thisMonth';
        		document.querySelector('.calendar-bottom').appendChild(span);

        		console.log(item);
        	});
        	// 添加签到
        	function signToday() {
        		calendar.today.classList.add('sign-date');
        		document.querySelector('.sign-btn').style.background = '#cccccc';
        		document.querySelector('.sign-btn').removeEventListener('touchend', signToday);
        		howDate();
        	}


        	document.querySelectorAll('.thisMonth').forEach(function (item) {
        		signArray.forEach(function (innerItem) {
        			if (item.innerHTML == innerItem) {
        				item.classList.add('sign-date');
        			}
        		})

        		if (item.innerHTML == day.slice(1)) {

    				if (item.classList.contains('sign-date')) {
    					document.querySelector('.sign-btn').style.background = '#cccccc';
    				}else {
    					calendar.today = item;
    					document.querySelector('.sign-btn').addEventListener('touchend', signToday);

    				}
        		}
        	})
        	// 判断是否今日签到




        	// 球赋值
            document.querySelector('.entity span').innerHTML = month.slice(1) + '月',
            document.querySelector('.entity i').innerHTML = day.slice(1),
           	howDate();
        },
        // 获取月份天数 传入下个月第0天
        getMonthDays: function(year, month) {
            return new Date(year, month, 0).getDate();
        },
        // 获取月份有几个星期
        getWeekday: function (year, month, day) {
            return new Date(year, month - 1, day).getDay();
        },
        getweeksInMonth: function (year, month) {
            var days = getMonthDays(year, month);
            var FirstDayWeekday = getWeekday(year, month, 1);
            return Math.ceil(days + FirstDayWeekday);
        },
        getMonthDaysArray: function (year, month, day, type) {
            if (typeof day === 'undefined' && year === YEAR && month === MONTH) day = DAY;

            var dayArrays = [];
            var days = this.getMonthDays(year, month),
                preDays = this.getMonthDays(year, month - 1);
            var thisMonthFirstDayInWeek = this.getWeekday(year, month, 1),
                thisMonthLastDayInWeek = this.getWeekday(year, month, days);

            type = !type || type !== 1 ? 0 : 1;
            // 上月在当月日历面板中的排列
            for (var i = 0; i < thisMonthFirstDayInWeek; i++) {
                dayArrays.push({
                    dayNum: (preDays - thisMonthFirstDayInWeek + i + 1),
                    weekDay: WEEKTABLE[type].cn[i]
                })
            }
            // 当月日历面板中的排列
            for (var i = 1; i < days; i++) {
                var weekDayFlag = (thisMonthFirstDayInWeek + i - 1) % 7;
                dayArrays.push({
                    dayNum: i,
                    weekDay: WEEKTABLE[type].cn[weekDayFlag],
                    selected: i === +day,
                    isThisMonth: true
                })
            };
            // 下月在当月日历面板中的排列
            for (var i = 1; i <= (6 - thisMonthLastDayInWeek); i++) {
                var weekDayFlag = (thisMonthFirstDayInWeek + days + i - 1) % 7
                dayArrays.push({
                    dayNum: i,
                    weekDay: WEEKTABLE[type].cn[weekDayFlag]
                })
            };
            return dayArrays;
        }
    }
})();




window.onload = function() {
    calendar.init();
}