window.onload = function() {
    roulette.init_swiper();
    roulette.init_data();
    roulette.init_scroll();
    roulette.init_tap();
}


var roulette = (function() {
    return {
        me: {},
        init_data: function () {
            axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/roulette')
            .then(function(response){

                var data = response.data,
                    win_record = [],
                    integral = 0, num, name, phone, rule, len;

                if (data && data.length === 0) return;
                if (data.integral) integral = data.integral;
                if (data.rule) rule = data.rule;
                num = Math.floor(integral / 50);
                $('.integral').text(integral);
                $('.num').text(num);
                $('.rule').text(rule);           
                win_record = data.winningRecord;
                
                if (win_record && win_record.length != 0) {
                    len = win_record.length;
                    for (var i = 0; i < len; i++) {
                        name = win_record[i].name;
                        name = name.slice(0,1) + name.slice(1).replace(/./g, '*');
                        phone = win_record[i].phone;
                        phone = phone.slice(0,3) + phone.slice(3,7).replace(/\d+/g, '*****') + phone.slice(7);


                        roulette.me.swiper.appendSlide(`<div class=swiper-slide>
                                                        <span>${name}</span>
                                                        <span>${phone}</span>
                                                    </div>`);
                    }
                }





            })
            .catch(function (error){
              console.log(error);  
            })
        },
        init_scroll: function() {
            var mainScroll = new IScroll('#wrapper', {
                probeType: 3,
                tap: true
            })
        },
        init_swiper: function() {
            roulette.me.swiper = new Swiper('.swiper-container', {
                autoplay: {
                    disableOnInteraction: false 
                }, 
                loop: true,
                spaceBetween: 10,
            })
        },
        init_tap: function () {
            $('.show_prize').on('tap', function () {
                $('.transparent').show().off('click').on('click', function () {
                    $('.new_panel').hide();
                    $(this).hide();
                });
                $('.new_panel').show();
                $('.new_panel i').off('click').on('click', function () {
                   $('.new_panel').hide();
                   $('.transparent').hide(); 
                })


                axios.get('https://easy-mock.com/mock/5c77f974ee24c36460daaffb/example/roulette')
                    .then(function (response) {
                        var prize = response.data.prize;
                        if (prize && prize.length != 0) {
                            var i = 0, len = prize.length;

                            $('#sub_wrapper li').empty();
                            for (; i < len; i++) {
                                $('#sub_wrapper li').append(`<div class='sub_item'>
                                                            <span>${prize[i].time}</span>
                                                            <span>${prize[i].goods}</span>
                                                            </div>`)
                            }
                        
                            var subScroll = new IScroll('#sub_wrapper', {
                                probeType: 3,
                                tap: true
                            })    
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })    
            })
        }   
    }
})();