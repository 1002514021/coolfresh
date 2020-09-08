var { log } = console
$(document).ready(function () {
    /**
     * @module
     * @desc 文字轮播
     */
    $('#hSliderBar .scrollNews ul').width($('#hSliderBar .scrollNews ul').width() - $('#hSliderBar .scrollNews ul li:first-child').innerWidth());
    $('#hSliderBar .scrollNews ul').addClass('theanimation');
    let navData = [
        {
            text: '首页',
            url: 'index'
        },
        {
            text: '商城',
            url: 'goodList',
            children: [
                {
                    text: '新鲜水果',
                    url: 'goodList?categoryId=1'
                },
                {
                    text: '特色果饮',
                    url: 'goodList?categoryId=2'
                },
                {
                    text: '秘制果酱',
                    url: 'goodList?categoryId=4'
                },
                {
                    text: '原味果干',
                    url: 'goodList?categoryId=3'
                },
            ]
        },
        // {
        //     text: '活动促销',
        //     url: 'goodList'
        // },
        // {
        //     text: '包装定制',
        //     url: 'goodList'
        // },
        // {
        //     text: '游园活动',
        //     url: 'goodList'
        // },
        {
            text: '关于我们',
            url: 'about'
        },
        {
            text: '联系我们',
            url: 'contact'
        },
    ]
    for (item of navData) {
        if (item.children) {
            $('#nav .myUl').append(`
            <li name='${item.text}' class="myli">
                <a href="${item.url}" class="dropdown">
                    <span>${item.text}</span>
                    <span class=" iconfont">&#xe60a;</span>
                </a>
                <ul class="dropdownMenu"></ul>
            </li>
            `)
            for (lis of item.children) {
                $(`[name="${item.text}"] .dropdownMenu`).append(`
                    <li><a href="${lis.url}">${lis.text}</a></li>
                `)
            }
            function getDropdownHeight() {//不包含滚动条 
                return {
                    height: $('.dropdown')[0].offsetHeight,
                    width: $('#nav .dropdownMenu')[0].offsetWidth
                }
            }
            let wh = getDropdownHeight()
            $('#nav .dropdownMenu').css({
                top: wh.height,
                marginLeft: -wh.width / 2
            })
        } else {
            $('#nav .myUl').append(`
            <li name='${item.text}' class="myli">
            <a href="${item.url}">${item.text}</a>
            </li>
        `)
        }
    }
    /**
     * @method
     * @returns {number}header的高
     * @desc 动态获取header的高来作为header的marginBottom值
     */
    function getHeaderBarHeight() {//不包含滚动条 
        return $('#header')[0].offsetHeight
    }
    $('#hPlaceHolder').css({
        height: getHeaderBarHeight()
    })
    $.ajax({
        type: 'post',
        url: 'getHeaderData.do',
        success(data) {
            if (data.userInfo) {
                $('.isLogin').show()
                $('.noLogin').hide()
                $('.isLogin .userName').text(data.userInfo.uName)
                let cartNum = data.cartSum
                $('#toCart .cartNum').text(cartNum)
            } else {
                $('.isLogin').hide()
                $('.noLogin').show()
            }

        }
    })
})
/**
 * @desc 控制nav导航的点击样式
 */
$('#nav .myUl').on('click', '.myli', function (event) {
    $('#nav .myli').removeClass('headerActive')
    $(event.target).addClass('headerActive')
})

$('#hOthers .searchBtn').click(function () {
})

/**
 * @desc 控制导航条位置微信小程序二维码的显示与隐藏及样式
 */
var wxFlag = false
$('#hOthers .wx').click(function () {
    if (!wxFlag) {
        log(13)
        $('#hOthers .codeImgBox').css({
            display: 'block'
        })
        $('#hOthers .wx').css({
            color: '#78A206'
        })
    }
    else {
        $('#hOthers .codeImgBox').css({
            display: 'none'
        })
        $('#hOthers .wx').css({
            color: '#363F4D'
        })
    }
    wxFlag = !wxFlag
})

/**
 * @desc 点击进入购物车页面的时候要进行的判断，即如果登陆了就进入购物车页，如果没登陆则跳转到登陆页
 */
$('#toCart').on('click', function () {
    let _this = this
    $.ajax({
        type: 'post',
        url: 'getSession.do',
        success(data) {
            if (data.code == 200) {
                window.location.href = 'cart'
            } else {
                $('#cartModal').modal('show')
            }
        }
    })
})
$('#cartModal .modal-footer .btn-primary').click(function () {
    //跳到登录页
    self.location.href = 'login'
})

jQuery('#cartModal .btn-default').click(function () {
    $('#cartModal ').modal('hide');
    setTimeout(function () {
        // $('#cartModa2 ').modal('show'); 
    }, 320);
});


//账号注销
$('#logout').click(logOut)
function logOut(){
    $.ajax({
        type: 'post',
        url: 'clearSession.do',
        success(data) {
            if (data.code == 200) {
                self.location.href = 'index'
            }
        }
    })
}
$('.headerSearch').click(function () {
    if ($('#keyWord').val() == '') {
        $('.btn-keyword').trigger('click')
    } else {
        let keyword= $('#keyWord').val()
        window.location.href ='goodList?keyword='+keyword
    }
})

