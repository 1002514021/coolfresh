const pageDao = require("../dao/pageDao")
const pingpp = require('pingpp')('sk_test_TqXn148SSqvPSCyD84vjjHqH');
var path = 'E:/web/mycode'
var { log } = console
var myCtrl = {
    index(req, resp) {
        let sql = 'SELECT * from goods order by goodId desc'
        pageDao.dataDao(sql, [], function (err, data) {
            if (data.length > 0) {
                let goods = data
                let sql = 'select * from categories'
                pageDao.dataDao(sql, [], function (err, data) {
                    let goodItem = []
                    for (let i = 0; i < data.length; i++) {
                        let properties = []
                        for (let j = 0; j < goods.length; j++) {
                            if (data[i].categoryId == goods[j].categoryId) {
                                properties = properties.concat(goods[j])
                            }
                        }
                        let obj = {
                            categoryId: data[i].categoryId,
                            category: data[i].category,
                            describe: data[i].categoryDesc,
                            goods: properties.slice(0, 5)
                        }
                        //给我obj对象赋予动态的属性并赋值
                        // obj[data[i].category]=properties
                        //把对象obj合并到对象goodItem里面去
                        // Object.assign(goodItem,obj)
                        goodItem.push(obj)
                    }
                    var indexData = { goods: goodItem }
                    resp.render('index', indexData)
                })
            }
        })
    },
    login(req, resp) {
        resp.render('login', {})
    },
    register(req, resp) {
        resp.render('register', {})
    },
    forget(req, resp) {
        resp.render('forget', {})
    },
    my404(req, resp) {
        resp.render('404', {})
    },
    goodList(req, resp) {
        var goodListData
        let currentPage = 1;
        let pageTotal = 10;
        let {categoryId,keyword} = req.query;
        let start = (currentPage - 1) * pageTotal;
        let sql, arr, sql1, arr1 = [], sql2, arr2 = []
        if (categoryId) {
            arr = [req.query.categoryId, start, pageTotal];
            sql = 'select * from goods where categoryId=? order by goodId desc limit ?,?';
            sql1 = 'select count(*)as totalData from goods where categoryId=?';
            arr1 = [req.query.categoryId]
            sql2 = 'SELECT DISTINCT field  FROM goods where categoryId=?'
            arr2 = [categoryId]
        } else {
            if (keyword) {
                arr = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
                sql = 'select * from goods JOIN kind on goods.kindId=kind.kindId where  kindName like ?  or type like ?  or field like ? or nutritions like ?  or goodName like ? order by goodId desc'
                arr1 = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
                sql1= 'select count(*)as totalData from goods JOIN kind on goods.kindId=kind.kindId where  kindName like ?  or type like ?  or field like ? or nutritions like ?  or goodName like ? '
                sql2 = 'SELECT DISTINCT field  FROM goods JOIN kind on goods.kindId=kind.kindId where  kindName like ?  or type like ?  or field like ? or nutritions like ?  or goodName like ? '
                arr2 = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
            }else{
                arr = [start, pageTotal];
                sql = 'select * from goods order by goodId desc limit ?,? ';
                sql1 = 'select count(*)as totalData from goods';
                sql2 = 'SELECT DISTINCT field  FROM goods'
            }
        }
        pageDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let goods = data;
                pageDao.dataDao(sql1, arr1, function (err, data) {
                    if (data) {
                        totalData = data[0].totalData
                        pageDao.dataDao(sql2, arr2, function (err, data) {
                            if (data) {
                                let fieldData = []
                                for (item of data) {
                                    fieldData.push(item.field)
                                }
                                goodListData = { goods, totalData, pageTotal, fieldData }
                                resp.render('goodList', goodListData)
                            }
                        })
                    }
                })
            }
        })
    },
    goodDetails(req, resp) {
        let goodId = req.query.goodId
        let arr = [goodId]
        let sql = 'select * from goods where goodId=?'
        let sql1 = 'select goodImage from goodImgs where goodId=?'
        let sql2 = 'select * from comments join users on comments.account=users.account where goodId=?'
        pageDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                data[0].startTime = new Date(data[0].startTime).toLocaleDateString()
                data[0].endTime = new Date(data[0].endTime).toLocaleDateString()
                let goodInfo = data
                pageDao.dataDao(sql1, arr, function (err, data) {
                    if (data) {
                        let goodImages = data
                        pageDao.dataDao(sql2, arr, function (err, data) {
                            if (data) {
                                let comments = data
                                pageDao.dataDao('select * from goods order BY sellNum desc LIMIT 6',[],function(err,data){
                                    if(data){
                                        let sellGood=data
                                        let detailsData = { goodImages, goodInfo, comments ,sellGood}
                                        resp.render('details', detailsData)
                                    }
                                })
                                
                                
                            }
                        })

                    }
                })
            }
        })
    },
    cart(req, resp) {
        var cartData = {}
        let user = req.session.data[0].account
        let arr = [user]
        let sql = 'select * from cart join goods on goods.goodId=cart.goodId where account=? and flag=false'
        pageDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                cartData = { data }
                resp.render('cart', cartData)
            }
        })

    },
    checkout(req, resp) {
        let sql = 'select * from address where account=?'
        let sql1 = 'select * from cart join goods on cart.goodId=goods.goodId where account=? and flag=true'
        let user = req.session.data[0].account
        let arr = [user]
        let checkData = {}
        pageDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                addresses = data
                pageDao.dataDao(sql1, arr, function (err, data) {
                    if (data) {
                        let goods = data
                        checkData = { addresses, goods }
                        resp.render('checkout', checkData)
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },

    payment(req, resp) {
        let orderCode = req.query.order
        log(orderCode)
        let arr = [orderCode]
        let sql = 'select * from orders where orderCode=?'
        pageDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let payCode = data[0].payCode
                if (payCode == '') {
                    // state:0代表没有付款 1代表已付款
                    let paymentData = { data, state: 0 }
                    resp.render('payment', paymentData)
                } else {
                    pingpp.setPrivateKeyPath(path + "/primary.pem");
                    pingpp.charges.retrieve(
                        payCode,
                        function (err, charge) {
                            if (charge) {
                                if (charge.paid) {
                                    pageDao.dataDao('update orders set state="已付款" where orderCode=?',arr,function(err,data){
                                        if(data){
                                            let paymentData = { data, state: 1 }
                                            resp.render('payment', paymentData)
                                        }else{
                                            log(err)
                                        }
                                    })
                                } else {
                                    let paymentData = { data, state: 0 }
                                    resp.render('payment', paymentData)
                                }
                            } else {
                                log(err)
                            }
                        }
                    );
                }

            } else {
                log(err)
            }
        })
    },
    personal(req, resp) {
        let user = req.session.data[0].account
        let arr = [user]
        let personalData = {}
        let sql = 'select * from users where account=?'
        pageDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                data[0].birthDay = new Date(data[0].birthDay).toLocaleDateString().replace('/', '-').replace('/', '-').replace('/', '-')
                let year = data[0].birthDay.split('-')[0]
                let mouth = data[0].birthDay.split('-')[1]
                let day = data[0].birthDay.split('-')[2]
                if (mouth <= 9) {
                    mouth = '0' + mouth
                }
                if (day <= 9) {
                    day = '0' + day
                }
                let dataArr = [year, mouth, day]
                data[0].birthDay = dataArr.join('-')
                let userInfo = data
                sql = 'select * from address where account=?'
                pageDao.dataDao(sql, [user], function (err, data) {
                    if (data) {
                        let address = data
                        sql = 'select * from orders where account=?'
                        pageDao.dataDao(sql, arr, function (err, data) {
                            if (data) {
                                let myarr = []
                                for (item of data) {
                                    let payCode = item.payCode
                                    if (payCode != '') {
                                        pingpp.setPrivateKeyPath(path + "/primary.pem");
                                        pingpp.charges.retrieve(
                                            payCode,
                                            function (err, charge) {
                                                if (charge) {
                                                    if (charge.paid) {
                                                        myarr.push(item.orderCode)
                                                    }
                                                } else {
                                                    log(err)
                                                }
                                            }
                                        );
                                    }
                                    item.orderDate = new Date(item.orderDate).toLocaleDateString()
                                }
                                if (myarr.length == 0) {
                                    let orders = data
                                    sql = 'select DISTINCT(state) from states'
                                    pageDao.dataDao(sql, [], function (err, data) {
                                        if (data) {
                                            let states = data
                                            personalData = { userInfo, address, orders, states }
                                            resp.render('personal', personalData)
                                        } else {
                                            log(err)
                                        }
                                    })
                                } else {
                                    sql = 'update orders set state="已付款" where 1=1'
                                    for (item of myarr) {
                                        sql += 'or orderCode=?'
                                    }
                                    dataDao.dataDao(sql, myarr, function (err, data) {
                                        if (data) {
                                            sql = 'select * from orders where account=?'
                                            arr = [user]
                                            dataDao.dataDao(sql, arr, function (err, data) {
                                                if (data) {
                                                    for (item of data) {
                                                        item.orderDate = new Date(item.orderDate).toLocaleDateString()
                                                    }
                                                    let orders = data
                                                    sql = 'select DISTINCT(state) from states'
                                                    pageDao.dataDao(sql, [], function (err, data) {
                                                        if (data) {
                                                            let states = data
                                                            personalData = { userInfo, address, orders, states }
                                                            resp.render('personal', personalData)
                                                        } else {
                                                            log(err)
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
                                }
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
    contact(req, resp) {
        resp.render('contact', {})
    },
    about(req, resp) {
        resp.render('about', {})
    }

}
module.exports = myCtrl