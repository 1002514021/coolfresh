var totalMoney = 0
for (let i = 0; i < $('table .money').length; i++) {
    totalMoney += Number($('table .money').eq(i).text())
}
$('.totalMoney').text(totalMoney)
$(document).ready(function () {
    //渲染面包屑
    // if (document.referrer) {
    //     let parentPage = document.referrer.split('//')[1].split('/')[1].split('?')[0]
    //     log(parentPage)
    //     $('#breadcrumb .referrer a').attr('href', parentPage)
    //     $('#breadcrumb .referrer a').text(parentPage)
    // }
    $('#noGoods').css({
        height: $(window).height() - $('#header')[0].offsetHeight - $('#footer')[0].offsetHeight
    })
})
//窗体大小发生改变时触发
$(window).resize(function () {
    $('#noGoods').css({
        height: $(window).height() - $('#header')[0].offsetHeight - $('#footer')[0].offsetHeight
    })
})

//购物车商品的勾选
$('.chooseSome').click(function () {
    $('#chooseAllBtn').attr('checked', false)
})
$('#chooseAllBtn').click(function () {
    let flag = $('#chooseAllBtn').is(':checked')
    if (flag) {
        $('.chooseSome').prop("checked", flag);
    } else {
        $('.chooseSome').prop("checked", flag);
    }
})
//继续购物
$('.goshop').click(function () {
    window.location.href = 'goodList'
})
//去结算
$('.checkoutBtn').click(function(){
    if($('.chooseSome').is(':checked') > 0){
        let goodIds = []
        //去结算购物车商品，包含商品的id和数量
        // let goodItem=[]
        for (let i = 0; i < $('.chooseSome').length; i++) {
            if ($('.chooseSome').eq(i).is(':checked')) {
                // let id=$('.chooseSome').eq(i).parent().siblings('.goodId').text()
                // let num=$('.chooseSome').eq(i).parent().parent().find('.goodNumInput').val()
                // goodItem.push({goodId:id,number:num})
                goodIds.push($('.chooseSome').eq(i).parent().siblings('.goodId').text())
            }
        }
        $.ajax({
            type:'post',
            // data:{goodIds},
            data:{goodIds},
            url:'isCheched.do',
            success(data){
                if(data.code==200){
                    self.location.href='checkout'
                }else{
                    $('.btn-danger').trigger('click')
                }
            }
        })
    }else{
        $('.btn-info').trigger('click')
    }
})

//删除商品
$('.deleteBtn').click(function () {
    if ($('.chooseSome').is(':checked') > 0) {
        let flag = $('#chooseAllBtn').is(':checked')
        let goodIds = []
        let reqData = {}
        if (flag) {//flag=0代表清空购物车
            reqData = { flag: 0 }
        } else {//flag=1代表删除部分商品
            for (let i = 0; i < $('.chooseSome').length; i++) {
                if ($('.chooseSome').eq(i).is(':checked')) {
                    goodIds.push($('.chooseSome').eq(i).parent().siblings('.goodId').text())
                }
            }
            reqData = { flag: 1, goodIds }
        }
        $.ajax({
            type: 'post',
            url: 'deletCart.do',
            data: reqData,
            success(data) {
                if (data) {
                    $('.btn-success').trigger('click')
                    setTimeout(function () {
                        self.location.href = 'cart'
                    }, 1000)
                }
            }
        })
    } else {
        $('.btn-info').trigger('click')
    }
})