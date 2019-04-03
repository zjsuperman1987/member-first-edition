window.onload = function() {
    lottery.init();
}

var lottery = (function() {
    return {
        init: function() {
            lottery.scroller = new IScroll('.wrapper', {
                probeType: 3,
                tap: true,
            });
            var openDate = new Date($('.startTime span').text().trim().replace(/\-/g, '/'));

            if (openDate) {
                var timer = setInterval(function getTime() {
                    var currTime = footer.formate('YYYY/MM/DD hh:mm:ss'),
                        reduce = openDate.getTime() - new Date(currTime).getTime(),

                        // 天
                        days = Math.floor(reduce / (24 * 3600 * 1000)),
                        // 小时
                        middle = reduce % (24 * 3600 * 1000),
                        hours = Math.floor(middle / (3600 * 1000)),
                        // 分钟
                        middle = middle % (3600 * 1000),
                        minutes = Math.floor(middle / (60 * 1000)),
                        // 秒
                        middle = middle % (60 * 1000),
                        seconds = Math.round(middle / 1000);

                    $('.day-block').text(days)
                    $('.hours-block').text(hours)
                    $('.minutes-block').text(minutes)
                    $('.seconds-block').text(seconds)

                    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                        clearInterval(timer);
                    }
                }, 1000);
            }
        }
    }
})();