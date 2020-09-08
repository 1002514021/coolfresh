const dbpool = require("../config/dbCfg")
module.exports={
    // 使用连接池连接数据库
    dataDao(sql,arr,fn){
        dbpool.connect(sql,arr,(err,data)=>{
            fn(err,data)
        })
    }
}