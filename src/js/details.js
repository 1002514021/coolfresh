$(document).ready(function(){
    //判断是上架还是未上架
    let now=new Date().toLocaleDateString()
    if(new Date(now).getTime()<new Date($('.putaway').text()).getTime()){
        $('.unSell').show()
        $('.inSell').hide()   
    }
    //判断是否有评论
    if($('.good_comment_box').length==0){
        $('.noComment').show()
    }
    $('.imgUl').children().eq(0).addClass('activeImg')
    if(document.referrer){
        let parentPage=document.referrer.split('//')[1].split('/')[1].split('?')[0]
         $('#breadcrumb .referrer a').attr('href',parentPage)
         if(parentPage=='index'){
            $('#breadcrumb .referrer a').text('首页')
        }else if(parentPage=='goodList'){
            $('#breadcrumb .referrer a').text('商城')
        }
    }
    //图文详情
    $('.graphic_detailsTab').trigger('click')
    $('.graphic_details img').css({
        width:$('.graphic_details')[0].offsetWidth*0.9
    })
    $('.bigSlide').css({
        width:$('.bigSlide img').width()*$('.bigSlide img').length
    })
    if($('.smallSlide li').length<=5){
        $('.slideBtn').hide()
    }
    $('.smallSlideBox').css({
    })
    log($('.smallSlideBox').height()/2)
    $('.slideBtn').css({
        top:$('.smallSlideBox').height()/2-10
    })
    $('.smallSlide .imgUl').css({
        width:$('.smallSlide li')[0].offsetWidth*$('.smallSlide li').length+$('.smallSlide li').length*20
    })
})

/**
 * @desc 快速浏览模态框中点击左右按钮切换图片
 */
var marginLeft = 0
var quickViewIndex = 0
var imgSrc
$('.slideBtn').click(function () {
    if ($(this).attr('name') == 'pre') {
        if (($('.smallSlide .imgUl').width() - (-marginLeft)) >$('.smallSlide li')[0].offsetWidth*2+100) {
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
$('.smallSlide li').click(function () {
    quickViewIndex = $(this).index()
    $('.smallSlide li').removeAttr('class')
    $(this).attr('class', 'activeImg')
    imgSrc = $(this).find('img').attr('src')
    $('.bigSlideBox img').attr('src', imgSrc)
})

/**
 * @param {Number} obj goodId 当前选中商品的id
 */
function toQuickView(obj) {
    $.ajax({
        type: 'post',
        url: 'getGoodData.do',
        data: { goodId: obj },
        success(data) {
            log(data)
        }
    })
}
/**
 * @param {number} obj 当前对象的商品id
 */
function toDetails(obj) {
    window.location.href = 'details'
}
var current = 1
var pageTotal = $('#paginationBar .customNum').val()
var totalData = $('#paginationBar .totalData').text()
$('#paginationBar .customNum').change(function () {
    pageTotal = $('#paginationBar .customNum').val()
    $('#paginationBar .pageBtn').remove()
    $('#paginationBar .toNext').before(`
    <li onclick="changePage(1,${pageTotal})" class="pageBtnActive pageBtn">1</li>
    `)
    for (let i = 1; i < Math.ceil(totalData / pageTotal); i++) {
        $('#paginationBar .toNext').before(`
        <li onclick="changePage(${i + 1},${pageTotal})" class="pageBtn">${i + 1}</li>
        `)
    }
    changePage(1, pageTotal)
})
function changePage(page, pageTotal) {
    current = page
    let region = $('#region').val()
    let nutrition = $('#conditionBox .nutrition input').val()
    let lowest = $('#conditionBox .lowest').val()
    let highest = $('#conditionBox .highest').val()
    let sorting = $('#sorting').val()
    let categoryId = window.location.search.replace('?', '').split('=')[1]
    $.ajax({
        type: 'post',
        url: 'changePage.do',
        data: { page, pageTotal, categoryId, region, nutrition, lowest, highest, sorting },
        success(data) {
            totalData = data.totalData
            $('.totalData').text(totalData)
            $('#goods .sort_good_boxs').empty()
            $('.pagination').children('.pageBtn').remove()
            if (data) {
                if (data.data.length > 0) {
                    $('#paginationBar .toNext').before(`
                    <li onclick="changePage(1,${pageTotal})" class="pageBtnActive pageBtn">1</li>
                    `)
                    for (let i = 1; i < Math.ceil(totalData / pageTotal); i++) {
                    $('#paginationBar .toNext').before(`
                    <li onclick="changePage(${i + 1},${pageTotal})" class="pageBtn">${i + 1}</li>
                    `)
                    }
                    $('.pagination').children().removeClass('pageBtnActive')
                    $('.pagination').children().eq(current).addClass('pageBtnActive')
                    for (let i = 0; i < data.data.length; i++) {
                        $('#goods .sort_good_boxs').append(`
                        <div class="sort_good_box">
                        <div class="sort_good_details">
                            <div class="imgBox">
                                <img src="../images/${data.data[i].image}" alt="">
                            </div>
                            <div class="paras">
                                <div class="paras_title">
                                    <div class="para_goodName">${data.data[i].goodName}</div>
                                    <div class="sellNumBar"><span class="sellNum">100</span><span
                                            class="cellText">人已购买</span></div>
                                </div>
                                <div class="paras_others">
                                    <div class="price">
                                        <!-- 原价是最小份装的钱 -->
                                        <span class="tagSpan">售价：</span>
                                        <div class="differPrice">
                                            <span class="orinalPriceBox">
                                                <span>$</span>
                                                <span class="orinalPrice">${data.data[i].originalPrice}</span>
                                            </span>
                                            <span class="preferentialPriceBox">
                                                <span>$</span>
                                                <span class="preferentialPrice">${data.data[i].price}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="views">
                                        <span class="viewNum">${data.data[i].viewNum}</span>
                                        <span class="iconfont icon-liulanjilu"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sort_good_options">
                            <span onclick="addToCart(this)" class="add_to_cart iconfont icon-tubiaozhizuomoban"></span>
                            <span onclick="toQuickView(${data.data[i].goodId})" data-toggle='modal' data-target='#quickViewBox'
                                class="iconfont icon-kuaisuchakan" title='快速浏览'></span>
                            <span onclick="toDetails(${data.data[i].goodId})" class="iconfont icon-xiangqingchakan"
                                title='查看详情'></span>
                        </div>
                    </div>
                        `)
                    }
                }
            }
        }
    })
}
var totalPage = ''
function preNext(flag) {
    $('.toPre').removeClass('icon-jinyong_o')
    $('.toPre').addClass('icon-leftarrow')
    $('.toNext').removeClass('icon-jinyong_o')
    $('.toNext').addClass('icon-rightarrow')
    if (flag == 1) {
        if (current > 1) {
            current -= 1;
            changePage(current, pageTotal)
        } else {
            $('.toPre').removeClass('icon-leftarrow')
            $('.toPre').addClass('icon-jinyong_o')
        }
    } else if (flag == 2) {
        if (current < Math.ceil(totalData / pageTotal)) {
            current += 1;
            changePage(current, pageTotal)
        } else {
            $('.toNext').removeClass('icon-rightarrow')
            $('.toNext').addClass('icon-jinyong_o')
        }
    }
}
$('.searchBtn').click(function () {

    changePage(1, pageTotal)
})

$('.smallSlide li').click(function(){
    index=$(this).index()
    $('.smallSlide li').removeAttr('class')
    $(this).attr('class','activeImg')
    imgSrc=$(this).find('img').attr('src')
    $('.bigSlideBox img').attr('src',imgSrc)
})

function showCommentBox(obj){
   let commentBox= $(obj).parent().parent().siblings('.giveCommentBox')
   commentBox.show()
   commentBox.find('.giveComment').eq(0).focus()
}
function hideCommentBox(obj){
    $(obj).parent().parent().hide()
}
$('.graphic_detailsTab').click(function(){
    $('.graphic_details').show()
    $('.good_comments').hide()
    $('.otherInfoTabs span').removeClass('activeTabColor')
    $('.graphic_detailsTab').addClass('activeTabColor')
})
$('.good_commentsTab').click(function(){
    $('.graphic_details').hide()
    $('.good_comments').show()
    $('.otherInfoTabs span').removeClass('activeTabColor')
    $('.good_commentsTab').addClass('activeTabColor')
})

//详情页的加商品到购物车
$('#details .purchaseOpts .tocart').click(function(){
    let goodId=window.location.search.split('?')[1].split('=')[1]
    let goodNum=$('.customNum').val()
    let _this = this
    var cart = $('#toCart');
    $.ajax({
        type:'post',
        url:'addTocart.do',
        data:{goodId,goodNum},
        success(data){
            if(data.code==401){
            //    $('#cartModal').modal('show')
            }else if(data.code==200){
                var imgtodrag = $(_this).parent().parent().siblings('.leftBar').children('.bigSlideBox').find('img').eq(0);
                log(imgtodrag)
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
                setTimeout(function(){
                    $('#toCart .cartNum').text(data.number)
                },1800)
            }
        }
    })
})