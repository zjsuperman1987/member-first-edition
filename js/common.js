var footer = (function() {
    return {
        init: function() {
            var that = this;
            $('.footer li:nth-child(1), .footer li:nth-child(2), .footer li:nth-child(3)').on('click', function() {
                var text = $(this).find('span').text();
                var path = that.getRootPath();
                switch (text) {
                    case '首页':
                        path = path + '/index.html';
                        window.location.href = path;
                        break;
                    case '扫码':
                        that.generator_scan();
                        $('.scane-delete-icon').on('click', function(){
                            $('.scane-wrapper').remove();
                        })
                        break;
                    case '我的':
                        path = path + '/src/mine/mine.html';
                        window.location.href = path;
                        break;
                    default:
                        break;
                }
            })

         // 阻止双击放大
            var lastTouchEnd = 0;
            document.addEventListener('touchstart', function(event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            });
            document.addEventListener('touchend', function(event) {
                var now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);

            // 阻止双指放大
            document.addEventListener('gesturestart', function(event) {
                event.preventDefault();
            }); 
        },
        getRootPath: function() {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp  
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp  
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083  
            var localhostPaht = curWwwPath.substring(0, pos);
            return localhostPaht;
            //获取带"/"的项目名，如：/uimcardprj  
            // var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);  
            // console.log(localhostPaht + projectName);
            // return(localhostPaht+projectName);          
        },
        generator_scan: function() {
            var s_wrapper = document.createElement('div'),
                s_container = document.createElement('div'),
                s_top = document.createElement('div'),
                header_icon = document.createElement('span'),
                delete_icon = document.createElement('span'),
                s_middle = document.createElement('div'),
                s_middle_no = document.createElement('div'),
                s_middle_no_span = document.createElement('span'),
                s_middle_no_text = document.createTextNode('No:'),
                s_middle_no_i = document.createElement('i'),
                s_middle_strip_type = document.createElement('img'),
                s_middle_two_yards = document.createElement('img'),
                scane_bottom = document.createElement('span'),
                text = document.createTextNode('请把手机屏幕调整到最亮');

            s_wrapper.className = 'scane-wrapper';
            s_container.className = 'scane-container';
            s_top.className = 'scane-top';
            header_icon.className = 'scane-header-icon';
            header_icon.style.backgroundImage = "url(" + this.getRootPath() + '/images/icon/IMG_1135_03.png' + ")";
            header_icon.style.backgroundSize = "100% 100%";




            delete_icon.className = 'scane-delete-icon';
            s_middle.className = 'scane-middle';
            s_middle_no.className = 'scane-middle-No';
            s_middle_strip_type.className = 'scane-middle-strip-type';
            s_middle_strip_type.src = this.getRootPath() + '/images/icon/barCode.png';
            s_middle_two_yards.className = 'scane-middle-two-yards';
            s_middle_two_yards.src = this.getRootPath() + '/images/icon/yardCode.png';
            scane_bottom.className = 'scane-bottom';
            scane_bottom.appendChild(text);
            s_middle_no_span.appendChild(s_middle_no_text);
            s_middle_no.appendChild(s_middle_no_span);
            s_middle_no_i.className = 'serial_number';
            s_middle_no.appendChild(s_middle_no_i);
            s_middle.appendChild(s_middle_no);

            s_wrapper.appendChild(s_container);
            s_container.appendChild(s_top);
            s_top.appendChild(header_icon);
            s_top.appendChild(delete_icon);
            s_container.appendChild(s_middle);
            s_middle.appendChild(s_middle_no);
            s_middle.appendChild(s_middle_strip_type);
            s_middle.appendChild(s_middle_two_yards);
            s_wrapper.appendChild(scane_bottom);
            document.body.appendChild(s_wrapper);


            // 调用ajax 获取编号
            var code = document.createTextNode('99928281');
            document.querySelector('.serial_number').appendChild(code);
        },
        getTime: function () { 
            // 日期
            var date = new Date(); 
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate(); 
            var time = year + "-" + month + "-" + day;
            return time;
        }
    }
})()