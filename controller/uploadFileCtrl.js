let {log}=console
const dataDao=require('../dao/dataDao')
module.exports={
    upload(req,resp){
        let userImage = req.file.filename
        let user=req.session.data[0].account
        log(user)
        log(userImage)
        let arr=[userImage,user]
        let sql='update users set photo=? where account=?'
        dataDao.dataDao(sql,arr,function(err,data){
            if(data){
                resp.redirect('personal')
                // resp.send({code:200})
            }else{
                resp.send({code:501})
                log(err)
            }
        })
    },
    uploadImages(req,resp){
        let detailArr=[]
        for(let item of req.files){
            detailArr.push(item.filename)
        }
        resp.send({detailArr})
    }
}