
var mySlideInterval
var index = 0
$(document).ready(function () {
    $('[name="关于我们"]').trigger('click')
    $('#aboutBanner img').css({
        width: $('#aboutBanner').width(),
        height: $(window).height() * 0.48
    })
    $('.slideList').css({
        width: $('#aboutBanner img').width(),
        height: $('#aboutBanner img').height()
    })
    mySlideInterval = setInterval('mySlide()', 1600)//banner轮播定时器
})