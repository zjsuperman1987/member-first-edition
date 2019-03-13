 (function() {
// transform: rotate(2120eg)
        // 奖品配置
        var awards = [
                { 'index': 0, 'text': '耳机', 'name': 'icono-headphone' },
                { 'index': 1, 'text': 'iPhone', 'name': 'icono-iphone' },
                { 'index': 2, 'text': '相机', 'name': 'icono-camera' },
                { 'index': 3, 'text': '咖啡杯', 'name': 'icono-cup' },
                { 'index': 4, 'text': '日历', 'name': 'icono-calendar' },
                { 'index': 5, 'text': '电脑', 'name': 'icono-keyboard' },
                { 'index': 6, 'text': '键盘', 'name': 'icono-keyboard' },
                { 'index': 7, 'text': '音响', 'name': 'icono-keyboard' },
                { 'index': 8, 'text': '鼠标', 'name': 'icono-keyboard' },
            ],
            len = awards.length,
            turnNum = 1 / len; // 文字旋转 turn 值

        var gbWheel = $('#gbWheel')[0],
            lineList = gbWheel.querySelector('ul.gb-wheel-line'),
            itemList = gbWheel.querySelector('.gb-wheel-list'),
            lineListHtml = [],
            itemListHtml = [];

        var transform = preTransform();

        awards.forEach(function(v, i, a) {
            // 分隔线
            lineListHtml.push('<li class="gb-wheel-litem" style="' + transform + ': rotate(' + (i * turnNum + turnNum / 2) + 'turn)"></li>');

            // 奖项
            itemListHtml.push('<div class="gb-wheel-item">');
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


        // 旋转
        var i = 0;
        $('#gbLottery').on('tap', function() {
            i++;
            console.log(i);

            gbWheel.querySelector('.gb-wheel-content').style[transform] = 'rotate(' + i * 3600 + 'deg)';
        });

        // console.log(preTransform());

        // transform兼容
        function preTransform() {
            var cssPrefix,
                vendors = {
                    '': '',
                    Webkit: 'webkit',
                    Moz: '',
                    O: 'o',
                    ms: 'ms'
                },
                testEle = document.createElement('p'),
                cssSupport = {};

            // 嗅探特性
            Object.keys(vendors).some(function(vendor) {
                if (testEle.style[vendor + (vendor ? 'T' : 't') + 'ransform'] !== undefined) {
                    cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : '';
                    return true;
                }
            });

            /**
             * [兼容CSS前缀]
             * @param  {[type]} name [description]
             * @return {[type]}      [description]
             */
            function normalizeCss(name) {
                name = name.toLowerCase();
                return cssPrefix ? cssPrefix + name : name;
            }

            cssSupport = {
                transform: normalizeCss('Transform'),
            }

            return cssSupport.transform;
        }

    }());