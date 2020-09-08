$('.payMethod').click(function () {
    $('.payMethod').removeClass('activeMethod')
    $(this).addClass('activeMethod')
})
$('#pay').click(function () {
    let orderMoney = $('.orderMoney').text()
    let orderCode=$('.orderNum').text()
    let ip='192.168.1.3'
    $.ajax({
        type:'post',
        data:{orderMoney,orderCode,ip},
        url:'pay.do',
        success(data){
            self.location.href=data.payUrl
            // window.open()
        }
    })
})
//回退刷新
if(window.name != "refresh"){
    location.reload();
    window.name = "refresh";
}
else{
    window.name = "";
}