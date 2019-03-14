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

    // 弹窗
    function popFrame(string, time) {
        var timer;
        if (!time) time = 500;
        $('body .layer').remove();
        $('body').append('<div class=layer>' + string + '</div>');
        var timer = setTimeout(function() {
            $('body .layer').remove('.layer');
            clearTimeout(timer);
        }, time);
    }


    axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/roulette')
        .then(function(response) {
            console.log(response.data.turnTable);

            var len,
                awards = [],
                turnNum,
                initIndex,
                turnTable = response.data.turnTable,
                lineListHtml = [],
                itemListHtml = [],
                gbWheel = document.querySelector('#gbWheel'),
                lineList = gbWheel.querySelector('ul.gb-wheel-line'),
                itemList = gbWheel.querySelector('.gb-wheel-list'),
                transform = preTransform();


            if (!turnTable && turnTable.length === 0) {} else {
                len = turnTable.length;
                turnNum = 1 / len;

                // 取得奖品
                initIndex = Math.floor(Math.random() * len);

                turnTable.forEach(function(v, i, a) {
                    // 分割线
                    lineListHtml.push("<li class='gb-wheel-litem' style='" + transform + ": rotate(" + (i * turnNum + turnNum / 2) + "turn)'>" + "</li>");

                    // 奖项
                    itemListHtml.push("<div class='gb-wheel-item'>");
                    itemListHtml.push('<div class="gb-wheel-icontent" style="' + transform + ': rotate(' + (i * turnNum) + 'turn)">');
                    itemListHtml.push('<p class="gb-wheel-iicon">');
                    itemListHtml.push('<i class="' + v.name + '"></i>');
                    // itemListHtml.push('<img src="../../../images/icon/my_card.png">');
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
            var isTurn = true,
                preIndex = 0,
                rotate = 0,
                deg = 360 / len,
                nextIndex = initIndex;

            $('#gbLottery').on('tap', function() {
                var integral, num, timer;
                integral = parseInt($('.integral').text());
                num = parseInt($('.num').text());

                if (integral && integral - 50 >= 0) {
                    if (isTurn) {
                    	console.log(roulette.me.mainScroll);
                    	roulette.me.mainScroll.disable();
                        axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/roulette')
                            .then(function(response) {
                                if (response.data.turnTable && response.data.turnTable.length !== 0) {
                                    nextIndex = Math.floor(Math.random() * response.data.turnTable.length);
                                    console.log('请求中', nextIndex)
                                } else {
                                    nextIndex = 0;
                                }
                            })
                            .catch(function(error) {
                                console.log(error);
                            })

                        $('.integral').text(integral - 50);
                        $('.num').text(parseInt($('.num').text()) - 1);

                        console.log(preIndex, nextIndex)

                        if (preIndex - nextIndex < 0) {
                            rotate += (deg * (preIndex - nextIndex + len) + 3600);
                        } else {
                            rotate += (deg * (preIndex - nextIndex) + 3600);
                        }
                        // 初始化后， 点击抽奖得到 下次中奖记录
                        preIndex = nextIndex;
                        gbWheel.querySelector('.gb-wheel-content').style[transform] = 'rotate(' + rotate + 'deg)';
                        $('.gb-wheel-btn').css({ 'color': '#333' });

                        // 控制连续点击
                        isTurn = false;
                        timer = setTimeout(function() {
                            isTurn = true;
                            $('.gb-wheel-btn').css({ 'color': 'white' });
                            popFrame('恭喜你, 中得' + turnTable[preIndex].text, 1000);
                            obj = {
                            	time: footer.getTime(),
                            	goods: turnTable[preIndex].text
                            }
                        	console.log(obj.time, obj.goods);
                            roulette.me.currentLottery.push(obj)
                            roulette.me.mainScroll.enable();
                            clearTimeout(timer);
                        }, 6000);
                    }
                } else {
                    if (integral - 50 < 0) {
                        isTurn = false
                        popFrame('阁下快赚取积分吧...');
                        return;
                    }
                    popFrame('请稍等，系统为您计算积分');
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        })
})()