var index = 0
var mySlideInterval

/**
* @desc 页面初始化的部分样式
*/
$(document).ready(function () {
    //获取头部信息
    if(window.location.search){
        if(window.location.search.split('?')[1].split('=')[0]=='keyword'){
            $('#conditionBox').hide()
            let keyWord=decodeURI(window.location.search.split('?')[1].split('=')[1]) 
            $('#keyWord').val(keyWord)
        }
    }
    let pathname=window.location.pathname.split('/')[1]
    $("[name='商城']").trigger('click')
    $('#goodBanner img').css({
        width: $('#goodBanner').width(),
        height: $(window).height() * 0.48
    })
    $('.slideList').css({
        width: $('#goodBanner img').width(),
        height: $('#goodBanner img').height()
    })

    //banner轮播定时器
    mySlideInterval = setInterval('mySlide()', 1600)

    //判断是预约还是可购买
    let now = new Date().toLocaleDateString()
    for (let i = 0; i < $(' .startTime').length; i++) {
        if (new Date(now).getTime() < new Date($(' .startTime').eq(i).text()).getTime()) {
            $(' .startTime').eq(i).parent().find('.appointment').show()
            $(' .startTime').eq(i).parent().find('.add_to_cart').hide()
            $(' .startTime').eq(i).parent().parent().find('.appointBar').show()
            $(' .startTime').eq(i).parent().parent().find('.sellBar').hide()
        } else {
            $(' .startTime').eq(i).parent().find('.appointment').hide()
            $(' .startTime').eq(i).parent().find('.add_to_cart').show()
            $(' .startTime').eq(i).parent().parent().find('.appointBar').hide()
            $(' .startTime').eq(i).parent().parent().find('.sellBar').show()
        }
    }
})
$(window).resize(function () {
    $('#goodBanner img').css({
        width: $('#goodBanner').width(),
        height: $(window).height() * 0.48
    })
    $('.slideList').css({
        width: $('#goodBanner img').width(),
        height: $('#goodBanner img').height()
    })
})

/**
 * @desc 商品展示框鼠标移入移除效果
 */
$('.sort_good_boxs').on('mouseover mouseout', '.sort_good_box', function (event) {
    if (event.type == 'mouseover') {
        $(this).children('.sort_good_options').css({
            height: $('.sort_good_box')[0].offsetHeight,
            width: $('.sort_good_box')[0].offsetWidth,
            top: 0,
            left: 0
        })
    } else if (event.type == 'mouseout') {
        $(this).children('.sort_good_options').css({
            height: 0,
            width: 0,
            top: -$('.sort_good_box')[0].offsetHeight,
            left: 0
        })
    }
})
/**
 * @desc 初始化快速浏览模态框里的部分样式
 */
$('#quickViewBox').on('shown.bs.modal', function (e) {
    $('.bigSlide').css({
        width: $('.bigSlide img').width() * $('.bigSlide img').length
    })
    if ($('.smallSlide li').length <= 5) {
        $('.slideBtn').hide()
        $('.smallSlide').css('margin', '0')
    } else {
        $('.smallSlide').css('margin', 'auto')
    }
    $('.smallSlideBox').css({
        height: $('.smallSlideBox li')[0].offsetHeight
    })
    $('.slideBtn').css({
        top: $('.smallSlideBox').height() / 2 - 8
    })
    $('.smallSlide .imgUl').css({
        height: $('.smallSlideBox li')[0].offsetHeight,
        width: $('.smallSlide li')[0].offsetWidth * $('.smallSlide li').length + $('.smallSlide li').length * 2
    })
})
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
//请求数据渲染页面
function changePage(page, pageTotal) {
    current = page
    let region = $('#region').val()
    let nutrition = $('#conditionBox .nutrition input').val()
    let lowest = $('#conditionBox .lowest').val()
    let highest = $('#conditionBox .highest').val()
    let sorting = $('#sorting').val()
    let categoryId = window.location.search.replace('?', '').split('=')[1]
    let keyword = $('#keyWord').val()
    $.ajax({
        type: 'post',
        url: 'changePage.do',
        data: { page, pageTotal, categoryId, region, nutrition, lowest, highest, sorting, keyword },
        success(data) {
            $('#goods .sort_good_boxs').empty()
            $('.pagination').children('.pageBtn').remove()
            if (data) {
                totalData = data.totalData
                $('.totalData').text(totalData)
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
                    let now=new Date().toLocaleDateString()
                    for (let i = 0; i < data.data.length; i++) {
                        $('#goods .sort_good_boxs').append(`
                        <div class="sort_good_box">
                        <span style='display:none' class='startTime'>${data.data[i].startTime}</span>
                        <div class="sort_good_details">
                            <div class="imgBox">
                                <img src="../images/${data.data[i].image}" alt="">
                            </div>
                            <div class="paras">
                                <div class="paras_title">
                                    <div class="para_goodName">${data.data[i].goodName}</div>
                                    <div class="sellNumBar appointBar"><span class="cellText">预约量：</span><span class="appointNum">${data.data[i].appointNum}</span></div>
                                    <div class="sellNumBar sellBar"><span class="cellText">购买量：</span><span class="sellNum">${data.data[i].sellNum}</span></div>
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
                        <span onclick="appointment(${data.data[i].goodId})" class="appointment iconfont icon-banshuiyuyue"></span>
                        <span onclick="addToCart(this,${data.data[i].goodId})" class="add_to_cart iconfont icon-tubiaozhizuomoban"></span>    
                        <span onclick="toQuickView(${data.data[i].goodId})" data-toggle='modal' data-target='#quickViewBox'
                                class="iconfont icon-kuaisuchakan" title='快速浏览'></span>
                            <span onclick="toDetails(${data.data[i].goodId})" class="iconfont icon-xiangqingchakan"
                                title='查看详情'></span>
                        </div>
                    </div>
                        `)
                        
                    }
                    for(i=0;i<$('.sort_good_box').length;i++){
                        if(new Date(now).getTime()<new Date($('.sort_good_box').eq(i).find('.startTime').text()).getTime()){
                            $('.sort_good_box').eq(i).find('.add_to_cart').hide()
                            $('.sort_good_box').eq(i).find('.appointment').show()
                            $('.sort_good_box').eq(i).find('.appointBar').show()
                            $('.sort_good_box').eq(i).find('.sellBar').hide()
                        }else{
                            $('.sort_good_box').eq(i).find('.appointment').hide()
                            $('.sort_good_box').eq(i).find('.add_to_cart').show()
                            $('.sort_good_box').eq(i).find('.appointBar').hide()
                            $('.sort_good_box').eq(i).find('.sellBar').show()
    
                        }
                    }
                    
                }
            } else {
                $('.totalData').text(0)
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

