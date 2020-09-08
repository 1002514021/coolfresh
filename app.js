const express=require("express")
const logger=require("morgan")
const bodyParser=require("body-parser")
const favicon=require("serve-favicon")
const router=require("./routers/router")
const wxRouter=require("./routers/wxRouter")
const session=require("express-session")
const cookie=require("cookie-parser")
const app=express()
// const pingpp = require('pingpp')('sk_test_TqXn148SSqvPSCyD84vjjHqH');
app.use(logger("dev"))
app.use(cookie())
app.use(session({
    name:"save",
    secret:"123456",
    resave:true,
    rolling:true,
    cookie:{maxAge:300000000},
    saveUninitialized:true
}))
app.use(bodyParser.urlencoded({extend:false}))
app.use(bodyParser.json())
app.use(router)
app.use(wxRouter)
// pingpp.setPrivateKeyPath(__dirname + "/primary.pem");
app.set("views",__dirname+"/src/views")
app.set("view engine","ejs")//要下载ejs模块
app.use(express.static(__dirname+"/src"))
app.use(favicon(__dirname+"/src/images/favicon.ico"))
//当发生404页面错误的时候返回4040页面
app.use(function(req,resp){
    resp.status(404)
    resp.redirect('/404')
    // resp.sendFile(__dirname+'')
})
app.listen(1234,function () {
    console.log("1234服务器已启动")
})