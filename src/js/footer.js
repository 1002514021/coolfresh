var { log } = console
$(document).ready(function () {
    let fCenterData={
        phone:'430-6420-662',
        uls:[
            [
                {
                    liText:'关于我们',
                    liHref:'about',
                },
                {
                    liText:'联系我们',
                    liHref:'contact',
                },
            ],
            // [
            //     {
            //         liText:'积分使用规则',
            //         liHref:'',
            //     },
            //     {
            //         liText:'新手上路',
            //         liHref:'',
            //     },
            // ]
            
        ]
    }
    let uls=fCenterData.uls
    $('.fPhoneBar .phone').text(`${fCenterData.phone}`)
    for(let i=0;i<uls.length;i++){
        $('.fCenterLeftBaUls').append(`
            <ul id=ul${i}></ul>
        `)
        for(item of uls[i]){
            $(`#ul${i}`).append(`
            <li>
                <a href="${item.liHref}">${item.liText}</a>
            </li>
        `)
        }
    }
    let fHeaderData = [
        {
            itemIcon: 'icon-distribution',
            itemTitle: '专业配送',
            itemDescription: '与时俱进，鲜果速达'
        },
        {
            itemIcon: 'icon-fukuan',
            itemTitle: '在线付款',
            itemDescription: '多种途径，便捷支付'
        },
        {
            itemIcon: 'icon-kefu',
            itemTitle: '48小时VIP',
            itemDescription: '专属服务，帮您解答'
        },
        {
            itemIcon: 'icon-youxuan',
            itemTitle: '鲜果猎人',
            itemDescription: '甄选源头 精选地区之最'
        },
    ]
    for (item of fHeaderData) {
        $('#footer .fHeader ul').append(`
        <li>
            <span class="iconfont ${item.itemIcon}"></span>
            <div>
                <h3>${item.itemTitle}</h3>
                <h4>${item.itemDescription}</h4>
            </div>
        </li>
        `)
    }
})

/**
 * @module aside
 * @desc aside部分的js代码
 */
$(document).ready(function () {
    $(".side ul li").hover(function () {
        $(this).find(".sidebox").stop().animate({ "width": "124px" }, 200).css({ "opacity": "1", "filter": "Alpha(opacity=100)", "background": "#ae1c1c" })
    }, function () {
        $(this).find(".sidebox").stop().animate({ "width": "40px" }, 200).css({ "opacity": "0.8", "filter": "Alpha(opacity=80)", "background": "#000" })
    });
});
//回到顶部
function goTop() {
    $('html,body').animate({ 'scrollTop': 0 }, 600);
}

    window.onscroll=function(){
        // $(window).scrollTop()>=$('#header')[0].offsetHeight+$('#banner')[0].offsetHeight?$('.side').css("display","block"):$('.side').css("display","none")
        $(window).scrollTop()>=$('#header')[0].offsetHeight?$('.side').css("display","block"):$('.side').css("display","none")
    }