const express=require("express")
const multer  = require('multer')
const pageCtrl=require("../controller/pageCtrl")
const dataCtrl=require("../controller/dataCtrl")
const bgCtrl=require('../controller/bgCtrl')
const smsCtrl=require('../controller/smsCtrl')
const uploadFile=require('../controller/uploadFileCtrl')
const upload=require('../config/MulterCfg')
const router=express.Router()
router.get('/index',pageCtrl.index)
router.get('/login',pageCtrl.login)
router.get('/register',pageCtrl.register)
router.get('/forget',pageCtrl.forget)
router.get('/404',pageCtrl.my404)
router.get('/goodList',pageCtrl.goodList)
router.get('/details',pageCtrl.goodDetails)
router.get('/cart',pageCtrl.cart)
router.get('/checkout',pageCtrl.checkout)
router.get('/payment',pageCtrl.payment)
router.get('/personal',function(req,resp){
    //判断是否登录
    if(req.session.data){
     pageCtrl.personal(req,resp)
    }else{
        resp.redirect('login')
    }
})
router.get('/contact',pageCtrl.contact)
router.get('/about',pageCtrl.about)
router.get('/get-img-verify',dataCtrl.getImageCode )
router.get('/cerification-codeService/send-verification-code',dataCtrl.sendVerificationCode)
//验证用户
router.post('/checkUser.do',dataCtrl.checkUser)
router.post('/checkPhone.do',dataCtrl.checkPhone)
router.post('/sendMSg.do',smsCtrl.smsPhone)
router.post('/verifyCode.do',smsCtrl.verifyCode)
router.post('/setPwd.do',dataCtrl.setPwd)
router.post('/register.do',dataCtrl.register)
//拿到登陆状态
router.post('/getSession.do',dataCtrl.getSession)
router.post('/getGoodData.do',dataCtrl.getGoodData)
router.post('/changePage.do',dataCtrl.changePage)
//添加商品到购物车
router.post('/addTocart.do',dataCtrl.addTocart)
//获取头部数据
router.post('/getHeaderData.do',dataCtrl.getHeaderData)
//删除购物车某条数据
router.post('/deletCart.do',dataCtrl.deletCart)
//修改购物车表的flag，即选中状态
router.post('/isCheched.do',dataCtrl.isCheched)
//编辑收获地址
router.post('/editAddress.do',dataCtrl.editAddress)
//删除收货地址
router.post('/deleteAddress.do',dataCtrl.deleteAddress)
//提交订单
router.post('/submitOrder.do',dataCtrl.submitOrder)
//删除订单
router.post('/cancelOrder.do',dataCtrl.cancelOrder)
//立即购买，添加商品到购物车，flag是true
router.post('/buyNow.do',dataCtrl.buyNow)
//头像上传
router.post('/uploadFile.do',upload.single('myFile'),uploadFile.upload)
//用户基础信息修改
router.post('/userInfo.do',dataCtrl.userInfo)
//按订单状态搜索订单
router.post('/selectByState.do',dataCtrl.selectByState)
//删除订单
router.post('/deleteOrder.do',dataCtrl.deleteOrder)
//重新渲染地址表
router.post('/reRenderAddr.do',dataCtrl.reRenderAddr)
//查看订单详情
router.post('/showOrderDetails.do',dataCtrl.showOrderDetails)
//页头关键字搜索商品
router.post('/keywordSearch.do',dataCtrl.keywordSearch)
//清除session
router.post("/clearSession.do",dataCtrl.clearSession)
//预约商品
router.post('/appointment.do',dataCtrl.appointment)
//支付
router.post('/pay.do',dataCtrl.pay)
//发表评论
router.post('/pubish.do',dataCtrl.pubish)
//修改浏览量
router.post('/updateView.do',dataCtrl.updateView)

// ------------------------------------ht后台请求
router.post('/bglogin.do',bgCtrl.bglogin)
//login页面加载的时候后台获取roles渲染页面
router.post('/getRoles.do',bgCtrl.getRoles)
//获取登录用户的权限列表
router.post('/getUserList.do',bgCtrl.getUserList)
//后台页面重置密码
router.post('/resetPwd.do',bgCtrl.resetPwd)
//后台页显示商品列表
router.post('/getGoodListData.do',bgCtrl.getGoodListData)
//商品下架处理
router.post('/shelve.do',bgCtrl.shelve)
//获取要修改的商品
router.post('/getObjGood.do',bgCtrl.getObjGood)
//上传图片
// var goodImg=multer({dest:'../src/upload'}).any()
router.post('/goodImg.do',upload.single('mainImg'),bgCtrl.goodMainImgs)
router.post('/goodGraphic.do',upload.single('graphicImg'),bgCtrl.goodMainImgs)
//获取订单
router.post('/getOrdersData.do',bgCtrl.getOrdersData)
//清空过期定单
router.post('/clearOver.do',bgCtrl.clearOver)
// 系统设置页数据
router.post('/getPermissionData.do',bgCtrl.getPermissionData)
//删除后台用户
router.post('/deleteManager.do',bgCtrl.deleteManager)
//修改用户角色
router.post('/modifyRole.do',bgCtrl.modifyRole)
//核对管理员账号是否存在
router.post('/bgCheckPhone.do',bgCtrl.checkPhone)
//添加后台用户
router.post('/createManager.do',bgCtrl.createManager)
//查看要删除的角色下是否有用户
router.post('/checkRole.do',bgCtrl.checkRole)
//删除角色
router.post('/delRole.do',bgCtrl.delRole)
//新增角色
router.post('/addRole.do',bgCtrl.addRole)
//修改角色
router.post('/modifyRole.do',bgCtrl.modifyRole)
//获取选定角色的权限列表
router.post('/getRolePermiss.do',bgCtrl.getRolePermiss)
//修改角色权限
router.post('/modifyPermiss.do',bgCtrl.modifyPermiss)
//上传商品展示图
router.post('/uploadImages.do',upload.array('goodImgs',10),uploadFile.uploadImages)
//获取修改商品的图片
router.post('/getGoodImg.do',bgCtrl.getGoodImg)
//添加商品
router.post('/addGood.do',bgCtrl.addGood)
//修改商品
router.post('/modifyGood.do',bgCtrl.modifyGood)
//报表
router.post('/getRecord.do',bgCtrl.getRecord)
//后台
router.post('/getIndexData.do',bgCtrl.getIndexData)
//接收订单
router.post('/processOrder.do',bgCtrl.processOrder)
module.exports=router