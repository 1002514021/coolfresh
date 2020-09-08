var {log}=console
var height=$(document).height()
// $(window).resize(function(){
//     height=height
// })
$(document).ready(function(){
    getImageCode()
    // $('#account').focus()
    $('#loginBox').css({
        height:height
    })
})
/**
 * 关闭按钮返回上级
 */
$('.closeBtn').click(function(){
    // window.history.back(-1)
    window.location.href='index'
})

/**
 * 验证账号格式
 * @param {number} item 1代表账号输入框 2代表是密码输入框
 * @param {object} obj 当前对象
 */
// $('#account').blur(checkAccount)
function checkFormat(item,obj){
    if($(obj).val()==''){
        $('#warning').toggle()
        $(obj).focus()
    }else{
        $('#warning').hide()
    }
}

/**
 * 获取图形验证码
 */
function getImageCode () {
    $("#image_code").val("");
    var _this=this
    $.ajax({
        type:"get",
        url: "/get-img-verify",
        data: {　　    　  
            size: 6,  //验证码长度
            width: 200,
            height: 130,
            background: "#f4f3f2",//干扰线条数
            noise: 2,
            fontSize: 60,
            ignoreChars: '0o1i',   //验证码字符中排除'0o1i'
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有           
            background:'#eee'
        },
        dataType: 'json'
    }).done(function (data) {
        $(".getImageCode").html(data.img);
        $(".getImageCode").off("click").on("click", function () {
            _this.getImageCode();
        });
    });
}  
/**
 * 验证图形验证码是否正确
 */  
function checkImgCode(){
    $('#warning').hide()
    $('#codeErr').hide()
    let codeText= $('#loginItem .svgCheck .codeText').val()
    if(codeText==''){
        $('#warning').show()
        $('#codeText').focus()
    }else{
        $.ajax({
            type:"get",
            url: "/cerification-codeService/send-verification-code",
            data:{imageCode: codeText},
            dataType: "json",
            success(data){
                if(data.code==204){
                    getImageCode()
                    $('#codeErr').show()
                    $('#codeText').val('').focus()
                }else if(data.code==200){
                }
            }        
            
        })
    }
    
}  
/**
 * 登录验证
 *  */          
$('#login').click(function(){
    let account=$('#account').val()
    let pwd=$('#pwd').val()
    $.ajax({
        type:'post',
        data:{account,pwd},
        url:'checkUser.do',
        success(data){
            if(data.code==200){
               window.location.href='index'
            }else if(data.code==204){
                getImageCode()
                $('#account').val('').focus()
                $('#pwd').val('')
                $('#codeText').val('')
            }
        }

    })
})      
