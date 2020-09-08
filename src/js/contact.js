var mySlideInterval
var index = 0
$(document).ready(function () {
    $('[name="联系我们"]').trigger('click')
    $('#contactBanner img').css({
        width: $('#contactBanner').width(),
        height: $(window).height() * 0.48
    })
    $('.slideList').css({
        width: $('#contactBanner img').width(),
        height: $('#contactBanner img').height()
    })
    mySlideInterval = setInterval('mySlide()', 1600)//banner轮播定时器
})
$(function () {
    ShowMap('102.219489,27.952339', '凉鲜生', '凉山西昌', '021-888888888',  '10');
})
function getInfo(id) {
    $.ajax({
        type: "POST",
        url: "WebUserControl/Contact/GetInfo.ashx",
        cache: false,
        async: false,
        data: { ID: id },
        success: function (data) {
            data = eval(data);
            var length = data.length;
            if (length > 0) {
                ShowMap(data[0]["Image"], data[0]["NewsTitle"], data[0]["Address"], data[0]["Phone"],data[0]["NewsNum"]);
            }
        }
    });
}
function ShowMap(zuobiao, name, addrsee, phone,  zoom) {
    var arrzuobiao = zuobiao.split(',');
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(arrzuobiao[0], arrzuobiao[1]), zoom);
    map.addControl(new BMap.NavigationControl());
    var marker = new BMap.Marker(new BMap.Point(arrzuobiao[0], arrzuobiao[1]));
    map.addOverlay(marker);
    var infoWindow = new BMap.InfoWindow('<p style="color: #bf0008;font-size:14px;">' + name + '</p><p>地址：' + addrsee + '</p><p>电话：' + phone + '</p>');
    marker.addEventListener("click", function () {
        this.openInfoWindow(infoWindow);
    });
    marker.openInfoWindow(infoWindow);
}