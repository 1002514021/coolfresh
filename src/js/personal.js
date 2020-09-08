$(document).ready(function () {
    $('.pwd').hide()
    $('.personalBar').hide()
    $('#userInfoBar').trigger('click')
})
function showBox(flag, obj) {
    $('.boxTab').removeClass('optUnderLine')
    $(obj).addClass('optUnderLine')
    $('.personalBar').hide()
    if (flag == 1) {
        $('#userInfo').show()
    }
    if (flag == 2) {
        $('#userOrder').show()
    }
    if (flag == 3) {
        $('#userAddr').show()
    }
}
//显示修改密码
$('.modifyPwd').click(function () {
    $('.pwd').toggle()
})
//模拟点击加载图片
$('.imgBox').click(function () {
    $('#imgLoad').trigger('click')
})

//input框的file改变触发事件
$('#imgLoad').change(function (e) {
    $('.saveImg').attr('disabled', false)
    var imgBox = e.target;
    uploadImg($('.imgBox img'), imgBox)
})
//头像上传预览
function uploadImg(element, tag) {
    var file = tag.files[0];
    var imgSrc;
    if (!/image\/\w+/.test(file.type)) {
        alert("看清楚，这个需要图片！");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        imgSrc = this.result;
        element.attr("src", imgSrc);
    };
}

$('.ensurePwd').blur(function () {
    if ($('.newpwd').val() != $('.ensurePwd').val()) {
        $('.btn-newPwd').trigger('click')
        $('.ensurePwd').val('')
    }
})
$('.newpwd').blur(function () {
    if ($('.originalpwd').val() == $('.newpwd').val()) {
        $('.newpwd').val('')
        $('.btn-pwdRepeat').trigger('click')
    }
})

//提交基础信息修改
$('#saveUserInfo').click(function () {
    $('.saveImg').trigger('click')
    let uName = $('.uName').val()
    let sex
    if ($('.man').attr('checked') == 'true') {
        sex = 0
    } else {
        sex = 1
    }
    let birthDay = $('.birthDay').val()
    let originalpwd = $('.originalpwd').val()
    let newpwd = $('.newpwd').val()
    let pwd = $('.ensurePwd').val()
    let sendData={ uName, sex, birthDay, originalpwd, pwd }
    if(originalpwd==''&&pwd==''&&newpwd==''){
        sendData={ uName, sex, birthDay}
    }else{
        if(originalpwd==''||pwd==''||newpwd==''||birthDay==''||uName==''||sex==''){
            $('.btn-not-null').trigger('click')
            return
        }
    }
    $.ajax({
        type: 'post',
        url: 'userInfo.do',
        data:sendData,
        success(data) {
            if (data.code == 200) {
                $('.btn-success').trigger('click')
                if(originalpwd!=''){
                    setTimeout(function(){
                        $.ajax({
                            type: 'post',
                            url: 'clearSession.do',
                            success(data) {
                                if (data.code == 200) {
                                    self.location.href = 'login'
                                }
                            }
                        })
                    },2000)
                }
            } else if (data.code == 501) {
                $('.btn-pwderror').trigger('click')
                $('.originalpwd').val('')
            }
        }
    })
})

/**
 * 按订单状态搜素
 *
 */
function selectState() {
    let state = $('#orderState').val()
    $.ajax({
        type: 'post',
        url: 'selectByState.do',
        data: { state },
        success(data) {
            if (data) {
                $('#orderTbody').empty()
                for (item of data) {
                    $('#orderTbody').append(`
                    <tr id=${item.orderCode}>
                    <td id='orderCode'>${item.orderCode}</td>
                    <td id='orderState'>${item.state}</td>
                    <td id="orderDate">${item.orderDate}</td>
                    <td id='orderNote'>${item.note}</td>
                    <td id="orderFee">${item.fee}</td>
                    <td id="orderNum">${item.totalNum}</td>
                    <td class='opts' style='text-align: left'>
                        <button class='todetail'>订单详情</button>
                        <button onclick='deleteOrder(${item.orderCode})'>删除订单</button>
                    </td>
                    </tr>
                    `)
                    $(`#${item.orderCode} .opts`).on('click', '.todetail', function () {
                        orderDetails(item.orderCode, item.state)
                    })
                    $(`#${item.orderCode} .opts`).remove('.specialOpt')
                    if (state == '未付款') {
                        $(`#${item.orderCode} .opts`).append(`
                    <button  class='specialOpt'>去付款</button>
                    `)
                        $(`#${item.orderCode} .opts`).on('click', '.specialOpt', function () {
                            pay(item.orderCode)
                        })
                    }
                }

            }
        }
    })
}

function pay(orderCode) {
    window.location.href = 'payment?order=' + orderCode
}
/**
 * 删除某条订单
 * @param {int} orderCode 要删除的订单
 */
function deleteOrder(orderCode) {
    $('#sureDeleteOrder').modal('show')
    $('.deleteOrderBtn').click(function () {
        $('#sureDeleteOrder').modal('hide')
        $.ajax({
            type: 'post',
            data: { orderCode },
            url: 'deleteOrder.do',
            success(data) {
                if (data.code == 200) {
                    $('.btn-success').trigger('click')
                    setTimeout(function () {
                        selectState()
                    }, 1000)
                }
            }
        })
    })
}

/**
 * 
 * @param {String} orderCode 订单编号
 */
function orderDetails(orderCode, state) {
    $('#orderDetails').modal('show')
    $('#orderDetailsTbody').empty()
    $.ajax({
        type: 'post',
        url: 'showOrderDetails.do',
        data: { orderCode },
        success(data) {
            if (data) {
                $('#orderDetailsTr').find('.toComment').remove()
                if (state == '未付款') {
                    for (item of data) {
                        $('#orderDetailsTbody').append(`
                    <tr>
                        <td>${item.orderCode}</td>
                        <td><a href="details?goodId=${item.goodId}"><img src="../images/${item.image}" alt=""></a></td>
                        <td>${item.goodName}</td>
                        <td>${item.price}</td>
                        <td>${item.originalPrice}</td>
                        <td>${item.number}</td>
                    </tr>
                    `)
                    }

                } else if (state == '已付款') {
                    for (item of data) {
                        $('#orderDetailsTbody').append(`
                    <tr>
                        <td>${item.orderCode}</td>
                        <td><a href="details?goodId=${item.goodId}"><img src="../images/${item.image}" alt=""></a></td>
                        <td>${item.goodName}</td>
                        <td>${item.price}</td>
                        <td>${item.originalPrice}</td>
                        <td>${item.number}</td>
                        <td  class='tocommentBtn'><button onclick="tocomment('${item.orderCode}','${item.goodId}',this)" style='background-color:transparent;border:none'>去评论</button></td>
                    </tr>
                    `)
                    
                    }
                    $('#orderDetailsTr').append(`
                    <th style="width:10%" class='toComment'>评论</th>
                    `)
                }

            }
        }
    })
}
//去评论
function tocomment(orderCode, goodId,obj) {
    $('#commentBox').show()
    $('.icon-star').click(function () {
            if ($(this).is('.choosedStar')) {
                $(this).removeClass('choosedStar')
                $(this).nextAll().removeClass('choosedStar')
                $('.icon-star').eq(0).addClass('choosedStar')
            } else {
                $(this).addClass('choosedStar')
                $(this).prevAll().addClass('choosedStar')
            }
        let starNum = $('.choosedStar').length
        switch (starNum) {
            case 1: $('.starResult').text('非常差'); break;
            case 2: $('.starResult').text('差'); break;
            case 3: $('.starResult').text('一般'); break;
            case 4: $('.starResult').text('好'); break;
            case 5: $('.starResult').text('非常好'); break;
        }
    })
    let now=new Date().toLocaleDateString()
    $('#publish').click(function(){
    let comment=$('#commentTextarea').val()
    let startNum= $('.choosedStar').length
    if(comment==''){
        comment='非常好'
    }
        $.ajax({
            type:'post',
            data:{startNum,comment,orderCode, goodId,now},
            url:'pubish.do',
            success(data){
                if(data.code==200){
                    $('.btn-success').trigger('click')
                    setTimeout(() => {
                        $('.starResult').text('非常好')
                        $('.icon-star').addClass('choosedStar')
                        $('#commentTextarea').val('')
                        $('#commentBox').hide()
                        $(obj).text('追加评论')
                    }, 2000);
                }
            }
        })
    })
    $('#cacelPublish').click(function () {
        $('#commentBox').hide()
        // $('.tocommentBtn').text('已评论')
    })
}



