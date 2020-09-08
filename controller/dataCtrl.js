const dataDao = require("../dao/dataDao")
const svgCaptcha = require('svg-captcha');
//支付
const pingpp = require('pingpp')('sk_test_TqXn148SSqvPSCyD84vjjHqH');
var path = 'E:/web/mycode'
var serveUrl = 'http://192.168.1.7:1234'//服务器地址
var { log } = console
var myCtrl = {
    /**
     * 获取图形验证码
     * @param {object} req 
     * @param {object} resp 
     */
    getImageCode(req, resp) {
        var option = req.query;
        // 验证码，有两个属性，text是字符，data是svg代码
        var code = svgCaptcha.create(option);
        // 保存到session,忽略大小写
        req.session["randomcode"] = code.text.toLowerCase();
        // 返回数据直接放入页面元素展示即可
        resp.send({
            img: code.data
        });
    },
    /**
     * @methd sendVerificationCode
     * @param {object} req  imageCode用户输入的验证码
     * @param {object} res code是200代表验证码输入正确，code是204代表错误
     */
    sendVerificationCode(req, res) {
        // var url = serveUrl + '/cerification-codeService/new-send-verification-code';
        var imageCode = req.query.imageCode.toLowerCase();
        var qs = req.query;
        for (let key in qs) {
            if (key === 'imageCode') {
                delete qs[key];
            }
        }
        if (imageCode !== req.session["randomcode"]) {
            res.send({ code: 204 });
            return false;
        }
        else {
            res.send({ code: 200 })
        }
    },
    checkUser(req, resp) {
        let arr = [req.body.account, req.body.pwd]
        let sql = 'SELECT * from users WHERE account=? and pwd=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data.length > 0) {
                req.session.data = data
                resp.send({ code: 200, session: req.session.data })
            } else {
                resp.send({ code: 204 })
            }

        })
    },
    /**
     * 验证手机号是否被注册
     * @param {Strin} req  待验证的手机号
     * @param {object} resp  发回值，204代表手机号已被注册，200代表手机号可以使用未被注册
     */
    checkPhone(req, resp) {
        let phone = req.body.phone
        let arr = [phone]
        let sql = 'SELECT * from users WHERE account=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data.length > 0) {
                resp.send({ code: 204 })
            }
            else {
                resp.send({ code: 200 })
            }
        })
    },
    setPwd(req, resp) {
        let account = req.body.account
        let pwd = req.body.pwd
        let arr = [pwd, account]
        let sql = "update users set pwd=? WHERE account=?"
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
                resp.send({ code: 204 })
            }
        })
    },
    register(req, resp) {
        let { account, pwd, address, lngLat, regTime } = req.body
        let arr = [account, pwd, address, lngLat, regTime]
        log(lngLat)
        let sql = 'INSERT into  users (account,uName,address,lnglat,regTime) VALUES(?,?,?,?,?)'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    },
    getSession(req, resp) {
        let userInfo = req.session.data;
        let mydata
        if (req.session.data) {
            mydata = { userInfo, code: 200 }
        } else {
            mydata = { code: 204 }
        }
        resp.send(mydata)
    },
    getGoodData(req, resp) {
        let arr = [req.body.goodId]
        let sql = 'SELECT * from goods join categories on goods.categoryId=categories.categoryId WHERE goodId=?';
        let sql1 = 'select goodImage from goodImgs where goodId=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let goodInfo = data
                dataDao.dataDao(sql1, arr, function (err, data) {
                    if (data) {
                        let goodImgs = data
                        let quickViewData = { goodInfo, goodImgs }
                        resp.send(quickViewData)
                    }
                })
            }
        })
    },
    //获取商品列表页的商品数据
    changePage(req, resp) {
        let { page, pageTotal, categoryId, region, nutrition, lowest, highest, sorting, keyword } = req.body
        let start = (page - 1) * pageTotal
        let arr = []
        let sql = 'select * from goods where 1=1 '
        let limit = ' limit ?,?'
        let order = ''

        if (sorting == 1) {
            order = ' order by price desc'
        } else if (sorting == 2) {
            order = ' order by price asc'
        } else if (sorting == 3) {
            order = ' order by viewNum desc'
        }
        if (keyword) {
            arr = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
            sql = 'select * from goods JOIN kind on goods.kindId=kind.kindId where  kindName like ?  or type like ?  or field like ? or nutritions like ?  or goodName like ? '
        }
        if (categoryId) {
            sql = `${sql} and categoryId = ?`
            arr.push(categoryId)
        } if (region != '') {
            sql = `${sql} and field = ?`
            arr.push(region)
        } if (nutrition != '') {
            nutrition = `%${nutrition}%`
            sql = `${sql} and nutritions like ?`
            arr.push(nutrition)
        } if (lowest != '') {
            if (highest != '') {
                sql = `${sql} and price BETWEEN ? and ?`
                arr.push(lowest)
                arr.push(highest)
            } else {
                sql = `${sql} and price > ?`
                arr.push(lowest)
            }
        } else {
            if (highest != '') {
                sql = `${sql} and price BETWEEN 0 and ?`
                arr.push(highest)
            }
        }
        sql = sql + order
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let totalData = data.length
                sql = sql + limit
                arr.push(start)
                arr.push(Number(pageTotal))
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        mydata = { data, totalData }
                        resp.send(mydata)
                    } else {
                        resp.send(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    //添加商品到购物车
    addTocart(req, resp) {
        if (req.session.data) {
            let goodId = req.body.goodId
            let goodNum = req.body.goodNum
            let userId = req.session.data[0].account
            let arr = [goodId], sql = 'update goods set viewNum=viewNum+1 where goodId=?'
            dataDao.dataDao(sql, arr, function (err, data) {
                if (data) {
                    arr = [userId, goodId]
                    sql = 'select *  from cart where account=? and goodId=? and flag=false'
                    dataDao.dataDao(sql, arr, function (err, data) {
                        if (data.length > 0) {
                            arr = [goodNum, userId, goodId]
                            sql = 'update cart set number=number+?  where account=? and goodId=? and flag=false'
                        } else {
                            arr = [userId, goodId, goodNum]
                            sql = "insert into cart VALUES (null,?,?,?,DEFAULT)"
                        }
                        dataDao.dataDao(sql, arr, function (err, data) {
                            if (data) {
                                dataDao.dataDao('select count(*) as sum from cart where account=? and flag=false', [userId], function (err, data) {
                                    if (data) {
                                        resp.send({ code: 200, number: data[0].sum })
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
        else {
            resp.send({ code: 401 })
        }
    },
    //获取头部信息
    getHeaderData(req, resp) {
        var headerData = {}
        if (req.session.data) {
            let userInfo = req.session.data[0]
            let account = req.session.data[0].account
            let arr = [account]
            let sql = 'select count(*)as sum from cart where account=? and flag=false'
            dataDao.dataDao(sql, arr, function (err, data) {
                let cartSum = data[0].sum
                headerData = { cartSum, userInfo }
                resp.send(headerData)
            })
        } else {
            resp.send(headerData)
        }
    },
    //删除一条商品
    deletCart(req, resp) {
        let flag = req.body.flag
        let user = req.session.data[0].account
        let arr = []
        let sql = ''
        if (flag == 0) {
            arr = [user]
            sql = "delete from cart where account=?"
        } else if (flag == 1) {
            arr = [user]
            sql = 'delete from cart where account=? and goodId=?'
            arr.push(req.body.goodIds[0])
            for (let i = 1; i < req.body.goodIds.length; i++) {
                sql += 'or goodId=? '
                arr.push(req.body.goodIds[i])
            }
        }
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                resp.send({ code: 501 })
            }
        })
    },
    //修改购物车表商品的flag，true代表移除了购物车去结算
    isCheched(req, resp) {
        let goodIds = req.body.goodIds
        // let goodItem=req.body
        let user = req.session.data[0].account
        let arr = [user]
        for (item of goodIds) {
            arr.push(item)
        }
        let sql = 'update cart set flag=true where account=? and goodId=?'
        for (let i = 1; i < goodIds.length; i++) {
            sql += ' or goodId= ?'
        }
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                resp.send({ code: 501 })
            }
        })
    },
    //编辑收获地址
    editAddress(req, resp) {
        // let recipient = req.body.recipient
        // let recipientPhone = req.body.recipientPhone
        // let province = req.body.province
        // let city = req.body.city
        // let area = req.body.area
        // let detailAddress = req.body.detailAddress
        // let postcode = req.body.postcode
        // let addrId = req.body.addrId
        let user = req.session.data[0].account
        let { recipient, recipientPhone, postcode, province, city, area, detailAddress, lngLat, addrId } = req.body
        let sql, arr
        if (addrId != '') {
            arr = [recipient, recipientPhone, postcode, province, city, area, detailAddress, lngLat, user, addrId,]
            sql = 'UPDATE address set recipient=?,phone=?,zipCode=? ,province=?,city=?,county=?,detailAddr=?,lngLat=?  where account=? and addressId=?'
        } else {
            arr = [user, recipient, recipientPhone, postcode, province, city, area, detailAddress, lngLat]
            sql = 'insert into address VALUES(null,?,?,?,?,?,?,?,?,DEFAULT,?)'
        }
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
                resp.send({ code: 501 })
            }
        })
    },
    //删除收货地址
    deleteAddress(req, resp) {
        let addressId = req.body.addressId
        let sql = 'delete from address where addressId=?'
        let arr = [addressId]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    },
    //提交订单
    submitOrder(req, resp) {
        let { addressId, orderDate, orderCode, note, money, number, goods } = req.body
        let user = req.session.data[0].account
        //插入数据到orders表
        let arr = [orderCode, user, '未付款', orderDate, note, addressId, money, number]
        let sql = 'insert into orders value (?,?,?,?,?,?,?,?,"",default)'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let sql = 'insert into orderDetails values'
                let arr = []
                for (let i = 0; i < goods.length - 1; i++) {
                    sql += '(null,?,?,?),'
                    arr.push(orderCode)
                    arr.push(goods[i].goodId)
                    arr.push(goods[i].goodNum)
                }
                sql += '(null,?,?,?);'
                arr.push(orderCode)
                arr.push(goods[goods.length - 1].goodId)
                arr.push(goods[goods.length - 1].goodNum)
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        let sql = 'delete from cart where account=? and goodId=?'
                        let arr = [user, goods[0].goodId]
                        for (let i = 1; i < goods.length; i++) {
                            arr.push(goods[i].goodId)
                            sql += 'or goodId=?'
                        }
                        dataDao.dataDao(sql, arr, function (err, data) {
                            if (data) {
                                resp.send({ code: 200 })
                            } else {
                                log(err)
                                resp.send({ code: 501 })
                            }
                        })
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    //取消生成订单
    cancelOrder(req, resp) {
        let user = req.session.data[0].account
        let {goods,isdel} = req.body
        let arr = [user]
        let sql = 'update cart set flag=false where account=? and goodId=?'
        if(isdel=='true'){
            if(goods&&goods.length>0){
                arr.push(goods[0])
                for (let i = 1; i < goods.length; i++) {
                    sql += 'or goodId=?'
                    arr.push(goods[i])
                }
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        resp.send({ code: 200 })
                    } else {
                        log(err)
                        resp.send({ code: 501 })
                    }
                })
            }
        }else{
            sql='delete from cart where account=? and goodId=?'
            arr.push(goods[0])
            dataDao.dataDao(sql,arr,function(err,data){
                if(data){
                    resp.send({ code: 200 })
                }else{
                    log(err)
                    resp.send({ code: 501 })
                }
            })
        }
        
    },
    //立即购买
    buyNow(req, resp) {
        let user = req.session.data[0].account
        let { id, num } = req.body
        let sql = 'insert into cart values(null,?,?,?,true)'
        let arr = [user, id, num]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                resp.send({ code: 501 })
            }
        })
    },
    userInfo(req, resp) {
        let { uName, sex, birthDay, originalpwd, pwd } = req.body
        let user = req.session.data[0].account
        let arr = []
        if (originalpwd) {
            log(1)
            let sql = 'select pwd from users where account=?'
            dataDao.dataDao(sql, [user], function (err, data) {
                if (data) {
                    if (originalpwd != data[0].pwd) {
                        resp.send({ code: 501 })
                    } else {
                        arr = [uName, pwd, birthDay, sex, user]
                        sql = 'UPDATE users SET uName=? , pwd=?,birthDay=?,sex=? WHERE account=?'
                        dataDao.dataDao(sql, arr, function (err, data) {
                            if (data) {
                                resp.send({ code: 200 })
                            } else {
                                log(err)
                            }
                        })

                    }
                } else {
                    log(err)
                }
            })
        } else {
            arr = [uName, birthDay, sex, user]
            sql = 'UPDATE users SET uName=? ,birthDay=?,sex=? WHERE account=?'
            dataDao.dataDao(sql, arr, function (err, data) {
                if (data) {
                    resp.send({ code: 200 })
                } else {
                    log(err)
                }
            })
        }





    },
    //按定单状态搜索订单
    selectByState(req, resp) {
        let user = req.session.data[0].account
        let state = req.body.state
        let arr = [user]
        let sql = 'select * from orders where account=?'
        if (state != '') {
            sql = 'select * from orders where account=? and state=?'
            arr.push(state)
        }
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                for (item of data) {
                    item.orderDate = new Date(item.orderDate).toLocaleDateString()
                }
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    deleteOrder(req, resp) {
        let user = req.session.data[0].account
        let orderCode = req.body.orderCode
        let arr = [user, orderCode]
        let sql = 'delete from orders where account=? and orderCode=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    },
    reRenderAddr(req, resp) {
        let user = req.session.data[0].account
        let sql = 'select * from address where account=?'
        dataDao.dataDao(sql, [user], function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    showOrderDetails(req, resp) {
        let { orderCode } = req.body
        let arr = [orderCode]
        let sql = 'SELECT * from orderdetails join goods on orderdetails.goodId=goods.goodId where orderdetails.orderCode=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    keywordSearch(req, resp) {
        let keyword = req.body.keyWord
        let arr = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
        log(keyword)
        let sql = 'select * from goods JOIN kind on goods.kindId=kind.kindId where  kindName like ? or type like ? or field like ? or nutritions like ?  or goodName like ? '
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                log(data)
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    clearSession(req, resp) {
        req.session.destroy()
        resp.send({ code: 200 })
    },
    appointment(req, resp) {
        if (req.session.data) {
            let { goodId, appointDate } = req.body
            let user = req.session.data[0].account
            let sql = 'update goods set viewNum=viewNum+1 , appointNum=appointNum+1 where goodId=?'
            let arr = [goodId]
            dataDao.dataDao(sql, arr, function (err, data) {
                if (data) {
                    sql = 'insert into appointment values(null,?,?,?)'
                    arr = [user, appointDate, goodId]
                    dataDao.dataDao(sql, arr, function (err, data) {
                        if (data) {
                            resp.send({ code: 200 })
                        } else {
                            log(err)
                        }
                    })
                } else {
                    log(err)
                }
            })
        } else {
            resp.send({ code: 202 })
        }


    },
    pay(req, resp) {
        let { orderMoney, orderCode, ip } = req.body
        pingpp.setPrivateKeyPath(path + "/primary.pem");
        pingpp.charges.create({
            subject: "coolfresh",
            body: "产地直销",
            amount: orderMoney,
            order_no: orderCode,
            channel: "alipay_qr",
            currency: "cny",
            client_ip: ip,
            app: { id: "app_P8Oar1S0Wv1OOmXj" }
        }, function (err, charge) {
            // 异步调用
            if (charge) {
                console.log(charge)
                let payCode = charge.id
                let arr = [payCode, orderCode]
                let payUrl = charge.credential.alipay_qr
                let sql = 'update orders set payCode=? where orderCode=?'
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        dataDao.dataDao('select orderdetails.goodId,number,sellNum from orderdetails left join goods on orderdetails.goodId=goods.goodId where orderCode=?', [orderCode], function (err, data) {
                            if (data) {
                                log(data)
                                arr = [data[0].number, data[0].goodId]
                                sql = 'INSERT INTO goods(goodId, sellNum) VALUES'
                                for (let i = 0; i < data.length - 1; i++) {
                                    sql += `(${data[i].goodId},${data[i].number + data[i].sellNum}),`
                                }
                                sql += `(${data[data.length - 1].goodId},${data[data.length - 1].number + data[data.length - 1].sellNum})`
                                sql += 'ON DUPLICATE KEY UPDATE sellNum = VALUES(sellNum)'
                                dataDao.dataDao(sql, [], function (err, data) {
                                    if (data) {
                                        let retureData = { payCode, payUrl }
                                        resp.send(retureData)
                                    } else {
                                        log(err)
                                    }
                                })

                            } else {
                                log(err)
                            }
                        })
                    }
                })
            } else {
                console.log(err)
                resp.send(err)
            }
        });
    },
    pubish(req, resp) {
        let { startNum, comment, orderCode, goodId, now } = req.body
        let user = req.session.data[0].account
        let sql = 'insert into comments values (null,?,?,?,?,?,?)'
        let arr = [comment, startNum, goodId, user, orderCode, now]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    },
    updateView(req, resp) {
        let { goodId } = req.body
        dataDao.dataDao('update goods set viewNum=viewNum+1 where goodId=?', [goodId], function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    }
}
module.exports = myCtrl