var { log } = console
var height = $(document).height()
$(document).ready(function () {
    $('#optBox').css({
        height: height
    })
    /**
     * 如果目前session你有用户信息那电话号码加载出来就有且状态为只读
     */
    $.ajax({
        type:'post',
        url:'/getSession.do',
        success(data){
            if(data.code==200){
                log(data.userInfo[0].account)
                $('#phone').val(data.userInfo[0].account)
                $('#phone').attr('readonly',"readonly")
            }else{
                $('#phone').removeAttr('readonly')
            }
        }
    })
})
/**
 * 关闭按钮返回上级
 */
$('.closeBtn').click(function () {
    window.location.href='login'
})
$('#phone').change(function () {
    $('#warning').text('')
    let phone = $('#phone').val()
    $.ajax({
        data: { phone },
        type: 'post',
        url: 'checkPhone.do',
        success(data) {
            if (data.code == 200) {
                $('#phone').val('').focus()
                $('#warning').text('手机号码未被注册，请重新输入')
            }
        }
    })
})
$('#sendCode').click(function () {
    let phone = $('#phone').val()
    if(phone!=''){
        $.ajax({
            data: {phone},
            type: 'post',
            url: 'sendMSg.do',
            success(data) {
                log(data)
                if(data.code==200){
                    $('.btn-smsSended').trigger('click')
                }
            }
        })
    }
})
$('#smsCode').blur(function () {
    $('#warning').text('')
    let mycode = $('#smsCode').val()
    let myphone = $('#phone').val()
    if(mycode!=''&& myphone!=''){
        let { code, phone } = { code: mycode, phone: myphone }
    $.ajax({
        type: 'post',
        url: 'verifyCode.do',
        data: { code, phone },
        success(data) {
            if (data.code != 200) {
                $('#smsCode').val('')
                $('#warning').text('验证码输入有误，请重新获取')
            }
        }
    })
    }
})
$('#reset').click(function () {
    $('#warning').text('')
    $('#reset').removeAttr('disabled')
    let account = $('#phone').val()
    let pwd = $('#ensure').val()
    let smsCode=$('#smsCode').val()
    let mypwd=$('#mypwd').val()
    if(account!=''&&pwd!=''&&smsCode!=''&&mypwd!=''){
        if($('#ensure').val()!=$('#mypwd').val()){
            $('#warning').text("两次输入密码不一致请重新输入")
            $('#ensure').val('')
        }
        $.ajax({
            type: 'post',
            url: 'setPwd.do',
            data: {account, pwd },
            success(data) {
                if (data.code == 200) {
                    //重置成功
                    window.location.href='login'
                    
                } else if (data.code == 204) {
                    //重置失败
                    $('.btn-danger').trigger('click')
                    // alert('重置失败')
                }
            }
        })
    }else{
        $('#warning').text('输入不能为空')
    }
})