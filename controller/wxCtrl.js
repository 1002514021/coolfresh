const dataDao=require("../dao/dataDao")
var myCtrl={
    getIndexData(req,resp){
        let bannerImgs=[
            'banner1.jpg',
            'banner2.jpg',
            'banner3.jpg'
        ]
        let vipTimeImgs=[
            'vipTime.jpg',
            'vipTime1.jpg',
            'vipTime2.jpg',
            'vipTimeBtnBg.jpg',
        ]
        let goodsItems=[
            {
                goodId:'1',
                goodImg:'good1.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'2',
                goodImg:'good2.jpg',
                goodTitle:'贵妃芒果约200g',
                goodDescribe:'每一丝香甜都是阳光的味道了睡觉地方了会计师砥砺奋进 发送到解放路可视对讲',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'3',
                goodImg:'good3.jpg',
                goodTitle:'贵妃芒果约200g',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'1',
                goodImg:'good1.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'2',
                goodImg:'good2.jpg',
                goodTitle:'贵妃芒果约200g',
                goodDescribe:'每一丝香甜都是阳光的味道了睡觉地方了会计师砥砺奋进 发送到解放路可视对讲',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'3',
                goodImg:'good3.jpg',
                goodTitle:'贵妃芒果约200g',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'1',
                goodImg:'good1.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'2',
                goodImg:'good2.jpg',
                goodTitle:'贵妃芒果约200g',
                goodDescribe:'每一丝香甜都是阳光的味道了睡觉地方了会计师砥砺奋进 发送到解放路可视对讲',
                originalPrice:'￥60.99',
                price:'￥49.89'
            },
            {
                goodId:'3',
                goodImg:'good3.jpg',
                goodTitle:'贵妃芒果约200g',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'',
                price:'￥49.89'
            }
        ]
        let indexData={
            bannerImgs:bannerImgs,
            vipTimeImgs:vipTimeImgs,
            goodsItems:goodsItems
        }
        resp.send(indexData)
    },
    getCartData(req,resp){
        let cartGoodsItems=[
            {
                goodId:'1',
                goodNum:'4',
                goodImg:'good1.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89',

            },
            {
                goodId:'2',
                goodNum:'4',
                goodImg:'good2.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89',

            },
            {
                goodId:'3',
                goodNum:'4',
                goodImg:'good3.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89',

            }
            ,
            {
                goodId:'4',
                goodNum:'4',
                goodImg:'good2.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89',

            },
            {
                goodId:'5',
                goodNum:'4',
                goodImg:'good3.jpg',
                goodTitle:'贵妃芒果约200g,就算了会计分录是看得见使肌肤了肯定是吉林省',
                goodDescribe:'每一丝香甜都是阳光的味道',
                originalPrice:'￥60.99',
                price:'￥49.89',

            }
        ]
        let cartItems={
            cartGoodsItems:cartGoodsItems
        }
        resp.send(cartItems)
    },
    getGroupBuyingData(req,resp){
        let groupBuyingGoodsItems=[
            {
                goodId:'1',
                goodImg:'banner1.jpg',
                goodTitle:'结束了快捷方式离开记录时间到了蓝景丽家',
                startTime:'2019/1/3',
                endTime:'2019/1/4',
                remainTime:'1',
                price:'23.35',
                groupNum:'3'
            },
            {
                goodId:'2',
                goodImg:'banner2.jpg',
                goodTitle:'结束了快捷方式离开记录时间到了蓝景丽家',
                startTime:'2019/1/3',
                endTime:'2019/1/4',
                remainTime:'1',
                price:'23.35',
                groupNum:'3'
            },
            {
                goodId:'3',
                goodImg:'banner3.jpg',
                goodTitle:'结束了快捷方式离开记录时间到了蓝景丽家',
                startTime:'2019/1/3',
                endTime:'2019/1/4',
                remainTime:'4',
                price:'23.35',
                groupNum:'3'
            },
            {
                goodId:'4',
                goodImg:'banner1.jpg',
                goodTitle:'结束了快捷方式离开记录时间到了蓝景丽家',
                startTime:'2019/1/3',
                endTime:'2019/1/4',
                remainTime:'1',
                price:'23.35',
                groupNum:'3'
            },
        ]
        let groupBuyingData={
            groupBuyingGoodsItems:groupBuyingGoodsItems
        }
        resp.send(groupBuyingData)
    },
    getPersonalCenterData(req,resp){
        let userInfo={
            uName:'火火',
            uImage:'uDefaultImage.png',
            vipType:'普通会员'

        }
        let personalCenterData={
            userInfo:userInfo
        }
        resp.send(personalCenterData)
    },
    getFlashSaleData(req,resp){
        let bannerImg=['banner2.jpg','banner3.jpg']
        
        let flashSaleGoodsItems=[
            {
                goodId:'1',
                goodsImg:'good1.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                remainNum:232,
                price:'6.5'
            },
            {
                goodId:'2',
                goodsImg:'good2.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                remainNum:232,
                price:'6.5'
            }
            ,
            {
                goodId:'3',
                goodsImg:'good3.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                remainNum:232,
                price:'6.5'
            }
            ,
            {
                goodId:'4',
                goodsImg:'good1.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                remainNum:232,
                price:'6.5'
            }


        ]
        let flashSaleData={
            bannerImg:bannerImg,
            flashSaleGoodsItems:flashSaleGoodsItems
        }
        resp.send(flashSaleData)
    },
    getInviteFriendsData(req,resp){
        let inviteFriendsBgImg='inviteFriends.jpg'
        let inviteFriendsData={
            inviteFriendsBgImg:inviteFriendsBgImg
        }
        resp.send(inviteFriendsData)
    },
    getIntegral(req,resp){
        let integralBanner=['integralBanner2.jpg','integralBanner1.jpg'];
        let integralGoods=[
            {
                goodId:'1',
                goodImg:'good1.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                integralNum:'30'
            },
            {
                goodId:'2',
                goodImg:'good3.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                integralNum:'112'
            },
            {
                goodId:'3',
                goodImg:'good2.jpg',
                goodTitle:'小台芒1份-约500g',
                goodIntroduce:'小巧清甜，萌翻舌尖',
                integralNum:'39'
            }
        ]
        let integralData={
            integralBanner:integralBanner,
            integralGoods:integralGoods
        }
        resp.send(integralData)
    }

}
module.exports=myCtrl