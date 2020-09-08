const sms=require('leancloud-storage')
const app_id='zMECAi0BBRNbxSxe96WqXHfO-gzGzoHsz'
const app_key='iV5xCoK4dUOvYGwBaWdwrIPI'
var {log}=console
sms.init({
    appId:app_id,
    appKey:app_key
})
var smsCtrl={
    smsPhone(req,resp){
        let phone=req.body.phone
        //把电话号码给第三方
        sms.Cloud.requestSmsCode({
            mobilePhoneNumber:phone,
            // template:'coolFresh',//控制台预设的模板名称
            code:'验证码',//控制台预设的短信签名
            ttl:1,//过期时间
            name:'coolFresh'
        }).then(function(data){
            //短信发送成功
            resp.send({code:200})
        }).catch(function(err){
            //短信发送失败
            log(err)
            resp.send({code:204})
        })
    },
    verifyCode(req,resp){
        let {code,phone}=req.body
        sms.Cloud.verifySmsCode(code,phone).then(function(){
            //验证成功
            resp.send({code:200})
        }).catch(function(err){
            //验证失败
            log(err)
            resp.send({code:204})
        })
    }
}
module.exports=smsCtrl