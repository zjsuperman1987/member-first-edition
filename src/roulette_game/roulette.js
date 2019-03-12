"use strict"
var t = null,
    centerX = 400,
    centerY = 250,
    ctx = null,
    ctx2 = null,
    lineLen = 150,
    myCanvas2 = null;
// 创建画图对象
window.onload = function() {
    var myCanvas = document.getElementById('canvas1');
    ctx = myCanvas.getContext('2d');

    myCanvas2 = document.getElementById('canvas2');
    ctx2 = myCanvas2.getContext('2d');

    roulette.createCircle2(); //绘制中间层转盘圆环
    roulette.createCircle1(); //绘制中间层转盘圆环
    roulette.createCircle(); //绘制中间层转盘圆环
    roulette.createpics(); //绘制中间层转盘圆环
    roulette.createCirText(); //绘制中间层转盘圆环
    roulette.initPoint(); //绘制中间层转盘圆环

}


var roulette = (function() {
    return {
        createCircle2: function() {
            var color = ["rgba(209,66,120,0.6)", "rgba(149,63,174,0.6)", "rgba(88,104,55,0.6)",
                "rgba(199,199,111,0.6)", "rgba(175,39,41,0.6)", "rgba(58,156,118,0.6)",
                "rgba(204,165,64,0.6)", "rgba(89,152,254,0.6)", "rgba(82,219,83,0.6)", "rgba(254,184,52,0.6)"
            ]; // 圆环颜色

            var startAngle = 0; // 其实弧度变量,
            var endAngle = 0; // 定义终止弧度变量

            for (var i = 0; i < 10; i++) { //画十等分空心圆
                ctx.save(); //保存当前绘画状态， 以便画完这幅画，在恢复到这个状态， 画另外一副
                ctx.beginPath(); //开始绘制	
                startAngle = Math.PI * (2 / 10) * i; //起始弧度
                endAngle = Math.PI * (2 / 10) * (i + 1) //终止弧度
                ctx.arc(centerX, centerY, 155, startAngle, endAngle, false); // 逐个绘制扇形，半径为155
                ctx.linWidth = 180.0 //定义线宽
                ctx.storkeStyle = color[i]; //给扇形的边框添加颜色样式
                ctx.stroke(); // 绘制空心圆
                ctx.restore(); //	恢复之前保存的状态
            }
        },
        createCircle1: function() {
            var color = ["rgba(209,66,120,0.6)", "rgba(149,63,174,0.6)", "rgba(88,104,55,0.6)",
                "rgba(199,199,111,0.6)", "rgba(175,39,41,0.6)", "rgba(58,156,118,0.6)",
                "rgba(204,165,64,0.6)", "rgba(89,152,254,0.6)", "rgba(82,219,83,0.6)", "rgba(254,184,52,0.6)"
            ]; //圆环上的颜色
            var startAngle = 0; //定义起始弧度变量
            var endAngle = 0; //定义终止弧度变量
            for (var i = 0; i < 10; i++) {
                //画一个由十等份扇形组成的空心圆形
                ctx.save(); //保存当前绘画状态，以便画完这幅画，再恢复到这个状态，画另一幅画
                ctx.beginPath(); //开始绘制
                startAngle = Math.PI * (2 / 10) * i; //起始弧度
                endAngle = Math.PI * (2 / 10) * (i + 1); //终止弧度
                //逐个绘制扇形，半径为155
                ctx.arc(centerX, centerY, 150, startAngle, endAngle, false);
                ctx.lineWidth = 160.0; //定义线宽
                ctx.strokeStyle = color[i]; //给扇形的边框添加颜色样式
                ctx.stroke(); //绘制空心圆
                ctx.restore(); //回复之前保存的状态
            }
        },
        createCircle: function() {
            var color = ["rgba(209,66,120,0.6)", "rgba(149,63,174,0.6)", "rgba(88,104,55,0.6)",
                "rgba(199,199,111,0.6)", "rgba(175,39,41,0.6)", "rgba(58,156,118,0.6)",
                "rgba(204,165,64,0.6)", "rgba(89,152,254,0.6)", "rgba(82,219,83,0.6)", "rgba(254,184,52,0.6)"
            ]; //圆环上的颜色
            var startAngle = 0; //定义起始弧度变量
            var endAngle = 0; //定义终止弧度变量
            for (var i = 0; i < 10; i++) {
                //画一个由十等份扇形组成的空心圆形
                ctx.save(); //保存当前绘画状态，以便画完这幅画，再恢复到这个状态，画另一幅画
                ctx.beginPath(); //开始绘制
                startAngle = Math.PI * (2 / 10) * i; //起始弧度
                endAngle = Math.PI * (2 / 10) * (i + 1); //终止弧度
                //逐个绘制扇形，半径为155
                ctx.arc(centerX, centerY, 55, startAngle, endAngle, false);
                ctx.lineWidth = 150.0; //定义线宽
                ctx.strokeStyle = color[i]; //给扇形的边框添加颜色样式
                ctx.stroke(); //绘制空心圆
                ctx.restore(); //回复之前保存的状态
            }
        },


        createpics: function() {
            var images = new Image(); //绘制圆心处的背景图片
            images.src = "game1.png"; //引用背景路径
            images.onload = function() { //当图片被加载时。绘制图片
                ctx.drawImage(images, centerX - 75, centerY - 75, 150, 150);
                ctx.restore();
            };
        },
        createCirText: function() {
            var info = ["一等奖电脑", "谢谢参与", "谢谢参与", "二等奖手机", "谢谢参与",
                "谢谢参与", "三等奖耳机", "谢谢参与", "谢谢参与", "谢谢参与"
            ]; //定义数组逐个保存转盘上的文字
            ctx.font = "Bold 20px Arial"; //设置字体
            ctx.textAlign = 'start'; //文本水平对齐方式
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "#000"; //文本垂直方向，基线位置
            var step = 2 * Math.PI / 10; // 1/10圆的弧度
            for (var i = 0; i < 10; i++) {
                ctx.save();
                ctx.beginPath();
                ctx.translate(centerX, centerY); //平移到圆心
                ctx.rotate(i * step + step / 2); //从时钟15点处开始旋转弧度i*step+step/2
                ctx.fillText(info[i], 130, 0);
                ctx.restore();
            }
        },
        initPoint: function() {
            //直线加箭头
            ctx2.beginPath();
            ctx2.moveTo(0, 2);
            ctx2.lineTo(lineLen, 2);
            ctx2.lineTo(lineLen, 4);
            ctx2.lineTo(lineLen + 10, 0); //箭头的长度
            ctx2.lineTo(lineLen, -4);
            ctx2.lineTo(lineLen, -2);
            ctx2.lineTo(0, -2);
            ctx2.fillStyle = "#C01020";
            ctx2.fill();
            ctx2.closePath();
        },

        doFly: function() {
            myCanvas2.width = 800;
            ctx2.translate(centerX, centerY); //移动坐标到画布中心
            if (t) {
                return;
            }
            var step = 50 + Math.random() * 10; //生成50~60的随机数
            var angle = 0; //旋转的角度
            t = setInterval(function() {
                step *= 0.95;
                if (step <= 0.1) {
                    clearInterval(t);
                    t = null;
                } else {
                    ctx2.restore();
                    ctx2.save();
                    ctx2.rotate(angle * Math.PI / 180);
                    ctx2.clearRect(-5, -5, 170, 18);
                    angle += step;
                    if (angle > 360) {
                        angle -= 360;
                    }
                    ctx2.restore();
                    ctx2.save();
                    ctx2.rotate(angle * Math.PI / 180);
                    initPoint(); //调用指针
                }
            }, 60); //设定旋转的时间

        }









    }
})()