// if (document.referrer) {
//     let parentPage = document.referrer.split('//')[1].split('/')[1].split('?')[0]
//     $('.referrer a').attr('href', parentPage)
//     $('.referrer a').text(parentPage)
// }

//购物清单总价
var ordersMoney = 0, freight = Number($('.freight').text()), totalNum = Number($('.totalNum').text())
for (let i = 0; i < $('.orderMoney').length; i++) {
    ordersMoney += Number($('.orderMoney').eq(i).text())
}
$('.ordersMoney').text(ordersMoney)
$('.orderTotal').text(ordersMoney + freight * totalNum)

//提交订单
$('.toPayment').click(function () {
    if ($('[name="addr"]').is(':checked')) {
        let addressId = $('.recipientInfo input').attr('checked', true).parent().parent().find('.addrId').eq(0).text()
        let orderDate = new Date().toLocaleDateString()
        let orderCode = 'cl' + new Date().getTime()
        let note = $('.note').val()
        let money = $('.orderTotal').text()
        let number = $('.totalNum').text()
        let goods = []
        for (let i = 0; i < $('.goodId').length; i++) {
            let good = { goodId: $('.goodId').eq(i).text(), goodNum: $('.goodId').eq(i).parent().find('.goodNum').text() }
            goods.push(good)
        }
        $.ajax({
            type: 'post',
            url: 'submitOrder.do',
            data: { addressId, orderDate, orderCode, note, money, number, goods },
            success(data) {
                if (data.code == 200) {
                    $('.btn-order-success').trigger('click')
                    setTimeout(function () {
                        self.location.href = 'payment?order=' + orderCode
                    }, 1000)
                } else {
                    $('.btn-danger').trigger('click')
                }
            }
        })
    } else {
        $('.btn-addr').trigger('click')
        window.scrollTo(0, $('.recipientInfo')[0].offsetTop - $('.recipientInfo').height())
    }
})
//点击取消订单按钮调用取消订单函数
$('.cancelOrder').click(function(){
    cancelOrders(1)
})
/**
 * 取消订单
 * @param {Number} flag flag=1代表点击取消按钮，0代表浏览器回退或页面异常关闭或浏览器关闭
 */
function cancelOrders(flag) {
    let lastPath=document.referrer.split('/')[document.referrer.split('/').length-1]
    let isdel
    // 判断是从购物车跳过来的还是从其他地方跳过来的isdel等于true代表是购物车跳转，false代表立即购买跳转
    if(lastPath=='cart'){
       isdel=true
    }else{
        isdel=false
    }
    let goods = []
    for (let i = 0; i < $('.goodId').length; i++) {
        let good = $('.goodId').eq(i).text()
        goods.push(good)
    }

    $.ajax({
        type: 'post',
        url: 'cancelOrder.do',
        data: {goods,isdel},
        success(data) {
            if (data.code == 200) {
                if (flag == 1) {
                    $('.btn-success').trigger('click')
                    setTimeout(() => {
                        if(isdel){
                            self.location.href = 'cart'
                        }else{
                            self.location.href = lastPath
                        }
                    }, 1000);
                }
            } 
            else {
                $('.btn-danger').trigger('click')
                
            }
        }
    })
}
// //监听浏览器回退事件
// let lastPath=document.referrer.split('/')[document.referrer.split('/').length-1]
// //加入以下两行代码，才能触发
// window.history.pushState('back',null,lastPath);
// window.history.back()
// // 监听事件的方法
// window.addEventListener("popstate", function(e) {
// cancelOrders(0)
// }, false);
// //监听浏览器/浏览器窗口关闭事件

