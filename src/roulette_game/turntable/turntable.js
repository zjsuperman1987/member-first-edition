(function() {
    function preTransform() {
        var cssPrefix,
            vendors = {
                '': '',
                Webkit: 'webkit',
                Moz: '',
                O: 'o',
                ms: 'ms'
            },
            testEl = document.createElement('div');
        cssSupport = {};

        // 嗅探特性
        Object.keys(vendors).some(function(vendor) {
            if (testEl.style[vendor + (vendor ? 'T' : 't') + 'ranform'] !== undefined) {
                cssPrefix = vendor ? '-' + vendor.toLowCase() + '-' : '';
                return true;
            }
        });
        /**
         *  [兼容css前缀]
         *  @param {[type]} name [description]
         *  rotateturn {[type]}  [description]
         */
        function normalizeCss(name) {
            name = name.toLowerCase();
            return cssPrefix ? cssPrefix + name : name;
        }

        cssSupport = {
            transform: normalizeCss('Transform')
        }

        return cssSupport.transform;
    }



    var gbWheel = document.querySelector('#gbWheel'),
        lineList = gbWheel.querySelector('ul.gb-wheel-line'),
        itemList = gbWheel.querySelector('.gb-wheel-list'),
        lineListHtml = [],
        itemListHtml = [];

    var transform = preTransform();



    axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/roulette')
        .then(function(response) {
            console.log(response.data.turnTable);
            var len,
                awards = [],
                turnNum,
                turnTable = response.data.turnTable;

            if (!turnTable && turnTable.length === 0) {
            } else {
                len = turnTable.length;
                turnNum = 1 / len;
                
                // 取得奖品
                var j = Math.floor(Math.random() * len)
                lottery = response.data.turnTable[j];


                turnTable.forEach(function(v, i, a) {
                    // 分割线
                    lineListHtml.push("<li class='gb-wheel-litem' style='" + transform + ": rotate(" + (i * turnNum + turnNum / 2) + "turn)'>" + "</li>");

                    // 奖项
                    itemListHtml.push("<div class='gb-wheel-item'>");
                    itemListHtml.push('<div class="gb-wheel-icontent" style="' + transform + ': rotate(' + (i * turnNum) + 'turn)">');
                    itemListHtml.push('<p class="gb-wheel-iicon">');
                    itemListHtml.push('<i class="' + v.name + '"></i>');
                    itemListHtml.push('</p>');
                    itemListHtml.push('<p class="gb-wheel-itext">');
                    itemListHtml.push(v.text);
                    itemListHtml.push('</p>');
                    itemListHtml.push('</div>');
                    itemListHtml.push('</div>');
                });

                lineList.innerHTML = lineListHtml.join('');
                itemList.innerHTML = itemListHtml.join('');
            }

            // 旋转
            var i = 0,
                isTurn = true;

            $('#gbLottery').on('tap', function() {
                var integral, num, timer;
                integral = parseInt($('.integral').text());
                num = parseInt($('.num').text());

                if (integral && integral - 50 >= 0) {
                    if (isTurn) {
                        axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/roulette')
                            .then(function(response) {
                                var preIndex = 0,
                                    nextIndex = 0,
                                    tempIndex,
                                    rotate,
                                    preLottery;

                                i++;
                                var nextIndex = response.data.turnTable.indexOf(lottery);                                

                                $('.integral').text(integral - 50);
                                $('.num').text(parseInt($('.num').text()) - 1);
                                
                                console.log(preIndex, nextIndex)

                                if (preIndex - nextIndex < 0) {
                                    rotate = (360 / len) * (preIndex - nextIndex + len) + i * 3600;
                                } else {
                                    rotate = i * 3600 + (preIndex - nextIndex) * 360;
                                }
                                preIndex = nextIndex;
                                gbWheel.querySelector('.gb-wheel-content').style[transform] = 'rotate(' + rotate + 'deg)';
                                $('.gb-wheel-btn').css({ 'color': '#333' });
                                // 提前请求下一次奖品
                                tempIndex = Math.floor(Math.random() * len);
                                preIndex = nextIndex;
                                nextIndex = tempIndex;

                                // 控制连续点击
                                isTurn = false;
                                timer = setTimeout(function() {
                                    isTurn = true;
                                    $('.gb-wheel-btn').css({ 'color': 'white' });
                                    clearTimeout(timer);
                                }, 6000);
                            })
                            .catch(function(error) {
                                console.log(error);
                            })
                    }
                } else {
                    if (integral - 50 < 0) {
                        isTurn = false
                        $('body').remove('.layer').append('<div class="layer">阁下积分不足，快赚取吧</div>');
                        timer = setTimeout(function() {
                            $('body .layer').remove();
                            clearTimeout(timer);
                        }, 1000)
                        return;
                    }
                    $('body').remove('.layer').append('<div class="layer">请稍等，系统为您计算积分</div>');
                    timer = setTimeout(function() {
                        $('body .layer').remove();
                        clearTimeout(timer);
                    }, 1000);
                }
            })

        })
        .catch(function(error) {
            console.log(error);
        })
})()