var { log } = console
/**
 * 电话号码正则
 */
function checkPhone(phone) {
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
    } else {
        return true
    }
}
/**
 * 
 * @param {Object} obj 当前点击元素
 * @param {String} id 加入购物车的商品id
 */
function addToCart(obj, id) {
    var cart = $('#toCart');
    var imgtodrag = $(obj).parent().parent().find('img').eq(0);
    $.ajax({
        type: 'post',
        data: { goodId: id, goodNum: 1 },
        url: 'addTocart.do',
        success(data) {
            if (data.code == 401) {
                $('#cartModal').modal('show')
            }
            else if (data.code == 501) {
                alert('插入失败')
            }
            else {
                if (imgtodrag) {
                    var imgclone = imgtodrag.clone().offset({
                        top: imgtodrag.offset().top,
                        left: imgtodrag.offset().left
                    }).css({
                        'opacity': '0.5',
                        'position': 'absolute',
                        'height': '150px',
                        'width': '150px',
                        'z-index': '100'
                    }).appendTo($('body')).animate({
                        'top': cart.offset().top + 10,
                        'left': cart.offset().left + 10,
                        'width': 75,
                        'height': 75
                    }, 1000, 'easeInOutExpo');
                    setTimeout(function () {
                        cart.effect('shake', { times: 2 }, 200);
                    }, 1500);
                    imgclone.animate({
                        'width': 0,
                        'height': 0
                    }, function () {
                        $(this).detach();
                    });
                }
                setTimeout(function () {
                    $('#toCart .cartNum').text(data.number)
                }, 1800)

            }
        }
    })
}
$('.purchaseOpts .tocart').click(function () {
    let goodNum = $('.customNum').val()
    let goodId = $(this).siblings('#goodId').text()
    $.ajax({
        type: 'post',
        url: 'addTocart.do',
        data: { goodId, goodNum },
        success(data) {
            if (data.code == 401) {
                $('.btn-warning').trigger('click')
            } else {
                $('.btn-success').trigger('click')
                $('#toCart .cartNum').text(data.number)
            }

        }
    })
})
/**
 * 
 * @param {Number} obj goodId 当前选中商品的id
 */
function toQuickView(obj) {
    $('.unSell').hide()
    $('.inSell').show()
    $('.choosePurchaseNum').show()
    $('.imgUl').empty()
    addViewNum(obj)
    $.ajax({
        type: 'post',
        url: 'getGoodData.do',
        data: { goodId: obj },
        success(data) {
            let goodInfo = data.goodInfo[0]
            let goodImgs = data.goodImgs
            let path = '../images/'
            let src = goodImgs[0].goodImage
            let imgSrc = path + src
            $('.bigSlideBox img').attr('src', imgSrc)
            for (item of goodImgs) {
                let imgSrc = path + item.goodImage
                $('.imgUl').append(`
                <li><img src='${imgSrc}'></li>
                `)
            }
            $('.imgUl').find('li').eq(0).addClass('activeImg')
            $('.quickview_gname').text(goodInfo.goodName)
            $('.price-original').text(goodInfo.originalPrice)
            $('.price-preferential').text(goodInfo.price)
            $('.good-describe').text(goodInfo.presentation)
            $('.measuringUnit .unit').text(goodInfo.measuringUnit)
            $('.nutritions').text(goodInfo.nutritions)
            $('.putaway').text(new Date(goodInfo.startTime).toLocaleDateString())
            $('.soldOut').text(new Date(goodInfo.endTime).toLocaleDateString())
            $('#goodId').text(goodInfo.goodId)
            $('.tocheckout').click(function () {
                tocheckout(obj, $('.customNum').val())
            })
            $('.toAppoint').click(function () {
                appointment($('#goodId').text())
            })
            let now = new Date().toLocaleDateString()
            if (new Date(now).getTime() < new Date(goodInfo.startTime).getTime()) {
                $('.unSell').show()
                $('.inSell').hide()
                $('.choosePurchaseNum').hide()
            }
        }
    })
}
function addViewNum(obj) {
    $.ajax({
        type: 'post',
        data: { goodId: obj },
        url: 'updateView.do',
        success(data) {

        }
    })
}
//跳转到详情页
function toDetails(obj) {
    addViewNum(obj)
    window.location.href = 'details?goodId=' + obj
}

//商品的加减按钮
$('.optBtnBar .minus').click(function () {
    log(1)
    if ($(this).parent().siblings('.customNum').val() > 1) {
        $(this).parent().siblings('.customNum').val(Number($(this).parent().siblings('.customNum').val()) - 1)
    }
})
$('.optBtnBar .add').click(function () {
    $(this).parent().siblings('.customNum').val(Number($(this).parent().siblings('.customNum').val()) + 1)
})

/**
 * @desc 快速浏览模态框中点击左右按钮切换图片
 */
var marginLeft = 0
var quickViewIndex = 0
var imgSrc
$('.slideBtn').click(function () {
    if ($(this).attr('name') == 'pre') {
        if (($('.smallSlide .imgUl').width() - (-marginLeft)) > $('.smallSlide li')[0].offsetWidth * 2) {
            $('.next').removeClass('icon-jinyong_o')
            $('.next').addClass('icon-rightarrow')
            quickViewIndex += 1
            $('.smallSlide li').removeAttr('class')
            $('.smallSlide li').eq(quickViewIndex).attr('class', 'activeImg')
            marginLeft -= $('.smallSlide li')[0].offsetWidth
            $('.smallSlide .imgUl').css({
                marginLeft: marginLeft
            })
        } else {
            $(this).removeClass('icon-leftarrow')
            $(this).addClass('icon-jinyong_o')
        }
    } else {
        if (marginLeft < 0) {
            $('.pre').removeClass('icon-jinyong_o')
            $('.pre').addClass('icon-leftarrow')
            quickViewIndex -= 1
            $('.smallSlide li').removeAttr('class')
            $('.smallSlide li').eq(quickViewIndex).attr('class', 'activeImg')
            marginLeft += $('.smallSlide li')[0].offsetWidth
            $('.smallSlide .imgUl').css({
                marginLeft: marginLeft
            })
        } else {
            $(this).removeClass('icon-rightarrow')
            $(this).addClass('icon-jinyong_o')
        }
    }
    imgSrc = $('.smallSlide li').eq(quickViewIndex).find('img').attr('src')
    $('.bigSlideBox img').attr('src', imgSrc)
})
$('.smallSlide').on('mouseover', 'li', function () {
    quickViewIndex = $(this).index()
    $('.smallSlide li').removeAttr('class')
    $(this).attr('class', 'activeImg')
    imgSrc = $(this).find('img').attr('src')
    $('.bigSlideBox img').attr('src', imgSrc)
})

$('#details .tocheckout').click(function () {
    tocheckout($(this).attr('name'), $('.customNum').val())
})
//立即购买
function tocheckout(id, num) {
    $.ajax({
        type: 'post',
        url: 'buyNow.do',
        data: { id, num },
        success(data) {
            if (data.code == 200) {
                self.location.href = 'checkout'
            }
        }
    })
}
//弹出新增编辑地址模态框 this代表修改，1代表添加,addrEditBtn(flag)flag为1代表新增，0代表修改
function modifyorAdd(obj) {
    $('#editAddr').modal('show')
    if (obj != 1) {
        let parent = $(obj).parent().parent()
        $('.addrId').text(parent.find('.addrId').eq(0).text())
        $('#recipient').val(parent.find('.recipient').eq(0).text())
        $('#recipientPhone').val(parent.find('.phone').eq(0).text())
        $('#province').val(parent.find('.province').eq(0).text())
        $('#city').val(parent.find('.city').eq(0).text())
        $('#town').val(parent.find('.county').eq(0).text())
        $('#detailAddress').val(parent.find('.detailAddr').eq(0).text())
        $('#postcode').val(parent.find('.zipCode').eq(0).text())
    }
}
// var recipient, recipientPhone, province, city, area, detailAddress, postcode
//模态框关闭事件
$('#editAddr').on('hide.bs.modal', function () {
    $('#recipient').val('')
    $('#recipientPhone').val('')
    $('#province').val('请选择')
    $('#city').val('请选择')
    $('#town').val('请选择')
    $('#detailAddress').val('')
    $('#postcode').val('')
})


/**
 * 新增/修改收货地址
 * @param {Number} obj 当前选中对象
 *  @param {Number}flag 0是个人中心，1是提交订单
 */
function addrEditBtn(obj, flag) {
    let recipient = $('#recipient').val()
    let recipientPhone = $('#recipientPhone').val()
    let province = $('#province').val()
    let city = $('#city').val()
    let area = $('#town').val()
    let detailAddress = $('#detailAddress').val()
    let postcode = $('#postcode').val()
    let addrId = $(obj).parent().find('.addrId').eq(0).text()
    let position = province + city + area
    for (let i = 0; i < $('#editAddr').find('input').length; i++) {
        if ($('#editAddr').find('input').eq(i).val() == '') {
            $('.btn-not-null').trigger('click')
            return;
        }
    }
    for (let i = 0; i < $('#editAddr').find('select').length; i++) {
        let seletVal = $('#editAddr').find('select').eq(i).val()
        if (seletVal == '请选择' || seletVal == null) {
            $('.btn-not-null').trigger('click')
            return;
        }
    }
    if (checkPhone(recipientPhone)) {//正则验证电话号码格式是否正确
        getLnglat(position).then(function (data) {
            let lngLat = data
            $.ajax({
                type: 'post',
                data: { recipient, recipientPhone, province, city, area, detailAddress, postcode, addrId, lngLat },
                url: 'editAddress.do',
                success(data) {
                    if (data.code == 200) {
                        $('.btn-success').trigger('click')
                        setTimeout(() => {
                            $('#editAddr').modal('hide')
                            reRender(flag)
                        }, 1000);
                    } else {
                        $('.btn-danger').trigger('click')
                    }
                }
            })
        }).catch(function (err) {
            log(err)
        })
    } else {
        $('.btn-format-error').trigger('click')
        return false
    }
}
//获取地址经纬度
function getLnglat(position) {
    var map = new BMap.Map("map_container");
    var localSearch = new BMap.LocalSearch(map);
    localSearch.search(position);
    var pro = new Promise(function (resolve, reject) {
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            result = poi.point.lng + "," + poi.point.lat
            resolve(result)
        });
    })
    return pro
}
/**
 * 
 * @param {Object} obj 当前选中元素
 * @param {Number}flag 0是个人中心，1是提交订单
 */
function deleteAddr(obj, flag) {
    $('#sureDelete').modal('show')
    $('.deleteBtn').click(function () {
        $('#sureDelete').modal('hide')
        let addressId = $(obj).parent().parent().find('.addrId').text()
        $.ajax({
            type: 'post',
            data: { addressId },
            url: 'deleteAddress.do',
            success(data) {
                if (data.code == 200) {
                    $('.btn-success').trigger('click')
                    setTimeout(function () {
                        $('#sureDelete').modal('hide')
                        reRender(flag)
                    }, 1000)
                }
            }
        })
    })

}

/**
 * 
 * @param {number} flag  0是个人中心，1是提交订单
 * 
 */
function reRender(flag) {
    $.ajax({
        type: 'post',
        url: 'reRenderAddr.do',
        success(data) {
            if (data) {
                $('.addresses tbody').empty()
                for (item of data) {
                    $('.addresses tbody').append(`
                    <tr>
                        <td class="addrId" style="display:none">${item.addressId}</td>
                        <td id='radio'  style="width:5%"><input name='addr' type="radio"></td>
                        <td class="recipient" style="width:10%">${item.recipient}</td>
                        <td style="width:20%">
                            <span class="province">${item.province}</span>
                            <span class="city">${item.city}</span>
                            <span class="county">${item.county}</span>
                            <span class="detailAddr">${item.detailAddr}</span>
                        </td>
                        <td class="phone" style="width:10%">${item.phone}</td>
                        <td class="zipCode" style="width:10%">${item.zipCode}</td>
                        <td style="width:20%"><button class="modifyAddr" onclick="modifyorAdd(this)">修改</button> / <button
                                onclick="deleteAddr(this,${flag})">删除</button></td>
                    </tr>
                    `)
                    if (flag == 0) {
                        $('#radio').remove()
                    }
                }
            }
        }
    })
}

/**
 * @method
 * banner轮播函数
 */
function mySlide() {
    if (index < $('.slideList li').length) {
        $('.slideList li').css({
            opacity: 0
        })
        $('.slideList li').eq(index).css({
            opacity: 1
        })
        index += 1
    } else {
        index = 0
        $('.slideList li').css({
            opacity: 0
        })
        $('.slideList li').eq(index).css({
            opacity: 1
        })
    }
}
//鼠标移入轮播停止
$('.slideList li').mouseover(function () {
    clearInterval(mySlideInterval)
    mySlideInterval = null
})
//鼠标移入轮播播放
$('.slideList li').mouseout(function () {
    mySlideInterval = setInterval('mySlide()', 1600)
})

//商品预约
function appointment(id) {
    log(1)
    let goodId = id
    let appointDate = new Date().toLocaleDateString()
    $.ajax({
        type: 'post',
        data: { goodId, appointDate },
        url: 'appointment.do',
        success(data) {
            if (data.code == 200) {
                $('.btn-appoint-success').trigger('click')
            } else if (data.code == 202) {
                $('.btn-warning').trigger('click')
            }
        }
    })
}
