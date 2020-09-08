var { log } = console
var height = $(document).height()
// $(window).resize(function(){
//     height=height
// })
$(document).ready(function () {
    $('#optBox').css({
        height: height
    })
})
/**
 * 关闭按钮返回上级
 */
$('.closeBtn').click(function () {
    window.history.back(-1)
})
$('#phone').change(function () {
    $('#warning').text('')
    let phone = $('#phone').val()
    $.ajax({
        data: { phone },
        type: 'post',
        url: 'checkPhone.do',
        success(data) {
            if (data.code == 204) {
                $('#warning').text('该手机号已被注册，请重新输入')
                $('#phone').val('').focus()
            }
        }
    })
})
$('#sendCode').click(function () {
    let phone = $('#phone').val()
    $.ajax({
        data: { phone },
        type: 'post',
        url: 'sendMSg.do',
        success(data) {
            if(data.code==200){
                $('.btn-smsSended').trigger('click')
            }else{
                $('.btn-danger').trigger('click')
            }
        }
    })
})
$('#smsCode').blur(function () {
    $('#warning').text('')
    let mycode = $('#smsCode').val()
    let myphone = $('#phone').val()
    $.ajax({
        type: 'post',
        url: 'verifyCode.do',
        data: { code: mycode, phone: myphone },
        success(data) {
            if (data.code != 200) {
                $('#smsCode').val('')
                $('#warning').text('验证码输入有误，请重新获取')
            }
        }
    })
})
$('#register').click(function () {
    $('#warning').text('')
    let account = $('#phone').val()
    let pwd = $('#ensure').val()
    let smsCode = $('#smsCode').val()
    let mypwd = $('#mypwd').val()
    let province = $('#province').val()
    let city = $('#city').val()
    let area = $('#town').val()
    let regTime=new Date().toLocaleDateString()
    if (account != '' && pwd != '' && smsCode != '' && mypwd != ''&&province!='' && city != ''&&area!='') {
        if($('#ensure').val()!=$('#mypwd').val()){
            $('#warning').text("两次输入密码不一致请重新输入")
            $('#ensure').val('')
        }
        let address=`${province}${city}${area}`
        getLnglat(address).then(function(data){
            log(data)
            let lngLat=data
            $.ajax({
            type: 'post',
            url: 'register.do',
            data: { account, pwd ,address,lngLat,regTime},
            success(data) {
                log(data)
                if (data.code == 200) {
                    window.location.href='login'
                } else {
                    alert('註冊失败')
                }
            }
        })
        }).catch(function(err){
            log(err)
        })
        
    }else{
        $('#warning').text('输入不能为空')
    }
})