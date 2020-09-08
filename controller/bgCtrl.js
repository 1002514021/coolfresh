const dataDao = require("../dao/dataDao")
const promissDao = require('../dao/promissDao')
var { log } = console
var myCtrl = {
    bglogin(req, resp) {
        let { account, pwd, role } = req.body
        let arr = [account, pwd, role]
        let sql = 'select * from manager where account=? and pwd=? and roleId=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                if (data.length > 0) {
                    req.session.data = data
                    resp.send({ code: 200, userInfo: data })
                } else {
                    resp.send({ code: 600 })
                }
            } else {
                log(err)
            }
        })
    },
    getRoles(req, resp) {
        dataDao.dataDao('select * from roles', [], function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    getUserList(req, resp) {
        let roleId = req.session.data[0].roleId
        let arr = [roleId]
        let sql = 'select * from permissionCfg join permission on permissionCfg.permissionId=permission.permissionId where roleId=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    resetPwd(req, resp) {
        let { pwd } = req.body
        let { account } = req.session.data[0]
        let sql = 'update manager set pwd=? where account=?'
        let arr = [pwd, account]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                resp.send({ code: 501 })
                log(err)
            }
        })
    },
    getGoodListData(req, resp) {
        //flag=1代表是初次渲染页面 0代表点击查询按钮请求数据
        let { dateValue, field, category, flag, pageSize, current } = req.body
        let begin = (current - 1) * pageSize
        let arr = [], goodsListData = {}
        let sql = 'select * from goods join categories on goods.categoryId=categories.categoryId where 1=1 '
        if (flag == 0) {
            if (dateValue) {
                arr.push(dateValue)
                sql += `and startTime=? `
            }
            if (field) {
                arr.push(field)
                sql += `and field=? `
            }
            if (category) {
                arr.push(category)
                sql += `and category=? `
            }
            sql += 'order by goodId desc '
            dataDao.dataDao(sql, arr, function (err, data) {
                if (data) {
                    let total = data.length
                    sql = sql + `limit ${begin},${pageSize}`
                    dataDao.dataDao(sql, arr, function (err, data) {
                        if (data) {
                            let goods = data
                            goodsListData = { goods, total }
                            resp.send(goodsListData)
                        } else {
                            log(err)
                        }
                    })
                } else {
                    log(err)
                }
            })

        } else {
            sql = sql + `order by goodId desc limit ${begin},${pageSize}`
            dataDao.dataDao(sql, [], function (err, data) {
                if (data) {
                    let goods = data
                    dataDao.dataDao('select distinct(field) from goods', [], function (err, data) {
                        if (data) {
                            let field = data
                            sql = 'select * from categories'
                            dataDao.dataDao(sql, [], function (err, data) {
                                if (data) {
                                    let categories = data
                                    dataDao.dataDao('select count(*)as total from goods', [], function (err, data) {
                                        if (data) {
                                            let total = data[0].total
                                            goodsListData = { categories, goods, field, total }
                                            resp.send(goodsListData)
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
                } else {
                    log(err)
                }
            })
        }
    },
    shelve(req, resp) {
        let { goodId } = req.body
        let sql = 'delete from goods where goodId=?'
        let arr = [goodId]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                sql = 'delete from cart where goodId=?'
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        resp.send({ code: 200 })
                    } else {
                        resp.send({ code: 600 })
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    getObjGood(req, resp) {
        let { goodId } = req.body
        let sql = 'select * from goods where goodId=?'
        let arr = [goodId]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let objGood = { data }
                resp.send(objGood)
            } else {
                log(err)
            }
        })
    },
    goodMainImgs(req, resp) {
        resp.send(req.file.filename)
    },
    getOrdersData(req, resp) {
        let { orderDate, orderCode, state, flag, pageTotal, currentPage, isProcessed } = req.body
        let sql = 'select * from orders where 1=1 '
        let arr = []
        let ordersData = {}
        if (orderDate) {
            sql += `and orderDate=?`
            arr.push(orderDate)
        }
        if (orderCode) {
            sql += `and orderCode=?`
            arr.push(orderCode)
        }
        if (state) {
            sql += `and state=?`
            arr.push(state)
        }
        if (isProcessed) {
            sql += `and isProcessed=?`
            arr.push(isProcessed)
        }
        sql += ' order by orderCode desc'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let totalPage = data.length
                let start = (currentPage - 1) * pageTotal
                sql += ` limit ${start},${pageTotal}`
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        let orders = data
                        dataDao.dataDao('select * from orderdetails', [], function (err, data) {
                            if (data) {
                                for (let i = 0; i < orders.length; i++) {
                                    let goodsId = []
                                    for (let j = 0; j < data.length; j++) {
                                        if (orders[i].orderCode == data[j].orderCode) {
                                            goodsId.push(data[j].goodId)
                                        }
                                    }
                                    goodsId = goodsId.join(',')
                                    orders[i].goodsId = goodsId
                                }
                                if (flag == 0) {
                                    dataDao.dataDao('select * from states', [], function (err, data) {
                                        if (data) {
                                            let states = data
                                            ordersData = { orders, states, totalPage }
                                            resp.send(ordersData)
                                        } else {
                                            log(err)
                                        }
                                    })
                                } else {
                                    ordersData = { orders, totalPage }
                                    resp.send(ordersData)
                                }
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
    },
    clearOver(req, resp) {
        let arr = req.body.overDates
        let sql = 'delete from orders where orderCode=? '
        for (let i = 0; i < arr.length - 1; i++) {
            sql += `or orderCode=? `
        }
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    },
    getPermissionData(req, resp) {
        let sql = 'select * from manager join roles on manager.roleId=roles.roleId where role!="超级管理员"'
        let arr = [], permissionData = {}
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                let managers = data
                dataDao.dataDao('select * from roles where role!="超级管理员"', [], function (err, data) {
                    if (data) {
                        let roles = data
                        dataDao.dataDao('select * from permission', [], function (err, data) {
                            if (data) {
                                let permission = data
                                permissionData = { managers, roles, permission }
                                resp.send(permissionData)
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
    },
    deleteManager(req, resp) {
        let { account } = req.body
        let sql = 'delete from manager where account=?'
        let arr = [account]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                dataDao.dataDao('select * from manager join roles on manager.roleId=roles.roleId where role!="超级管理员"', [], function (err, data) {
                    if (data) {
                        resp.send({ code: 200, managers: data })
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    modifyRole(req, resp) {
        let { account, roleId } = req.body
        let arr = [roleId, account]
        let sql = 'update manager set roleId=? where account=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                dataDao.dataDao('select * from manager join roles on manager.roleId=roles.roleId where role!="超级管理员"', [], function (err, data) {
                    if (data) {
                        resp.send({ code: 200, managers: data })
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    checkPhone(req, resp) {
        let { account } = req.body
        let sql = 'select * from manager where account=?'
        let arr = [account]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    createManager(req, resp) {
        let { account, uname, pwd, roleId, sex, regTime } = req.body
        let arr = [account, uname, pwd, roleId, sex, regTime]
        let sql = 'insert into manager values (?,?,?,?,?,?)'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                dataDao.dataDao('select * from manager join roles on manager.roleId=roles.roleId where role!="超级管理员"', arr, function (err, data) {
                    if (data) {
                        let managers = data
                        resp.send({ code: 200, managers })
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    checkRole(req, resp) {
        let { roleId } = req.body
        let sql = 'select * from manager where roleId=?'
        let arr = [roleId]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                log(err)
            }
        })
    },
    delRole(req, resp) {
        let { roleId } = req.body
        let sql = 'delete from roles where roleId=?'
        let arr = [roleId]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                dataDao.dataDao('select * from roles where role!="超级管理员"', [], function (err, data) {
                    if (data) {
                        let roles = data
                        resp.send({ roles, code: 200 })
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    addRole(req, resp) {
        let { role, roleDesc } = req.body
        let arr = [role, roleDesc]
        dataDao.dataDao('select * from roles where role=?', [role], function (err, data) {
            if (data) {
                if (data.length > 0) {
                    resp.send({ code: 600 })
                } else {
                    dataDao.dataDao('insert into roles values(null,?,?)', arr, function (err, data) {
                        if (data) {
                            dataDao.dataDao('select * from roles where role!="超级管理员"', [], function (err, data) {
                                if (data) {
                                    let roles = data
                                    resp.send({ code: 200, roles })
                                } else {
                                    log(err)
                                }
                            })
                        } else {
                            log(err)
                        }
                    })
                }
            } else {
                log(err)
            }
        })
    },
    modifyRole(req, resp) {
        let { roleId, roleDesc } = req.body
        log(roleId, ' ', roleDesc)
        let arr = [roleDesc, roleId]
        let sql = 'update roles set roleDesc=? where roleId=?'
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                dataDao.dataDao('select * from roles where role!="超级管理员"', [], function (err, data) {
                    if (data) {
                        let roles = data
                        resp.send({ code: 200, roles })
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    getRolePermiss(req, resp) {
        let { roleId } = req.body
        let sql = 'select * from permissionCfg join permission on permissionCfg.permissionId=permission.permissionId where roleId=?'
        let arr = [roleId]
        dataDao.dataDao(sql, arr, function (err, data) {
            if (data) {
                resp.send(data)
            } else {
                err
            }
        })
    },
    modifyPermiss(req, resp) {
        let { checkedId, roleId } = req.body
        let arr = []
        dataDao.dataDao('delete from permissionCfg where roleId=?', [roleId], function (err, data) {
            if (data) {
                if (checkedId.length > 0) {
                    let sql = 'insert into permissionCfg values '
                    for (let i = 0; i < checkedId.length - 1; i++) {
                        sql += `(null,${roleId},${checkedId[i]}),`
                        arr.push(roleId)
                        arr.push(checkedId[i])
                    }
                    sql += `(null,${roleId},${checkedId[checkedId.length - 1]})`
                    arr.push(roleId)
                    arr.push(checkedId[checkedId.length - 1])
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

    },
    getGoodImg(req, resp) {
        let { goodId } = req.body
        let goodManageData = {}, kinds = [], categories = []
        dataDao.dataDao('select * from kind', [], function (err, data) {
            if (data) {
                kinds = data
                dataDao.dataDao('select * from categories', [], function (err, data) {
                    if (data) {
                        categories = data
                        if (goodId) {
                            let arr = [goodId]
                            let sql = 'select * from goodimgs where goodId=?'
                            dataDao.dataDao(sql, arr, function (err, data) {
                                if (data) {
                                    let showImgs = data
                                    sql = 'select * from (goods join categories on goods.categoryId=categories.categoryId) join kind on goods.kindId=kind.kindId   where goodId=?'
                                    dataDao.dataDao(sql, arr, function (err, data) {
                                        if (data) {
                                            let goodInfo = data
                                            goodManageData = { showImgs, goodInfo, kinds, categories }
                                            resp.send(goodManageData)
                                        } else {
                                            log(err)
                                        }
                                    })
                                } else {
                                    log(err)
                                }
                            })
                        } else {
                            goodManageData = { kinds, categories }
                            resp.send(goodManageData)
                        }
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    addGood(req, resp) {
        let {
            goodId,
            goodName,
            presentation,
            type,
            price,
            originalPrice,
            newMainImg,
            field,
            category,
            sellTime,
            nutritions,
            measuringUnit,
            newGraphicImg,
            kind,
            goodListImg,
            shelveTime
        } = req.body
        let arr = [
            goodId,
            goodName,
            presentation,
            type,
            price,
            originalPrice,
            newMainImg,
            field,
            category,
            new Date(sellTime[0]).toLocaleDateString(),
            new Date(sellTime[1]).toLocaleDateString(),
            nutritions,
            measuringUnit,
            newGraphicImg,
            kind,
            shelveTime
        ]
        let sql = 'insert into goods values(?,?,?,?,0,?,?,?,?,?,?,?,?,?,?,0,0,?,?)'
        if (typeof (kind) != 'number') {
            promissDao.promissDao('insert into kind values(null,?)', [kind], function (err, data) {
            }).then(function (data) {
                promissDao.promissDao('select kindId from kind where kindName=?', [kind], function (err, kindData) {
                }).then(function (data) {
                    let kindId = data[0].kindId
                    arr = [
                        goodId,
                        goodName,
                        presentation,
                        type,
                        price,
                        originalPrice,
                        newMainImg,
                        field,
                        category,
                        new Date(sellTime[0]).toLocaleDateString(),
                        new Date(sellTime[1]).toLocaleDateString(),
                        nutritions,
                        measuringUnit,
                        newGraphicImg,
                        kindId,
                        shelveTime
                    ]
                    dataDao.dataDao(sql, arr, function (err, data) {
                        if (data) {
                            if (goodListImg.length > 0) {
                                arr = [goodId, goodListImg[0]]
                                sql = 'insert into goodimgs values(null,?,?),'
                                for (let i = 1; i < goodListImg.length - 1; i++) {
                                    arr.push(goodId)
                                    arr.push(goodListImg[i])
                                    sql += "(null,?,?),"
                                }
                                arr.push(goodId)
                                arr.push(goodListImg[goodListImg.length - 1])
                                sql += "(null,?,?)"
                                // arr = arr.concat(null, goodId, goodListImg[goodListImg.length - 1])
                                // sql += "(null,?,?)"
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
                })
            })
        } else {
            dataDao.dataDao(sql, arr, function (err, data) {
                if (data) {
                    if (goodListImg.length > 0) {
                        arr = [goodId, goodListImg[0]]
                        sql = 'insert into goodimgs values(null,?,?),'
                        for (let i = 1; i < goodListImg.length - 1; i++) {
                            arr.push(goodId)
                            arr.push(goodListImg[i])
                            sql += "(null,?,?),"
                        }
                        arr.push(goodId)
                        arr.push(goodListImg[goodListImg.length - 1])
                        sql += "(null,?,?)"
                        // arr = arr.concat(null, goodId, goodListImg[goodListImg.length - 1])
                        // sql += "(null,?,?)"
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
        }

    },
    modifyGood(req, resp) {
        let {
            goodId,
            goodName,
            presentation,
            type,
            price,
            originalPrice,
            newMainImg,
            field,
            category,
            sellTime,
            nutritions,
            measuringUnit,
            newGraphicImg,
            kind,
            goodListImg
        } = req.body
        log(goodListImg)
        let arr = [
            goodName,
            presentation,
            type,
            price,
            originalPrice,
            newMainImg,
            field,
            category,
            new Date(sellTime[0]).toLocaleDateString(),
            new Date(sellTime[1]).toLocaleDateString(),
            nutritions,
            measuringUnit,
            newGraphicImg,
        ]
        let sql = 'update goods set goodName=?,presentation=?,type=?,price=?,originalPrice=?,image=?,field=?,categoryId=?,startTime=?,endTime=?,nutritions=?,measuringUnit=?,googGraphic=?,kindId=? where goodId=?'
        if (typeof (kind) != 'number') {
            promissDao.promissDao('insert into kind values(null,?)', [kind], function (err, data) {
            }).then(function (data) {
                promissDao.promissDao('select kindId from kind where kindName=?', [kind], function (err, kindData) {
                }).then(function (data) {
                    let kindId = data[0].kindId
                    arr.push(kindId)
                    arr.push(goodId)
                    promissDao.promissDao(sql, arr, function (err, data) {
                        if (data) {
                            sql = 'select * from goodimgs where goodId=?'
                            promissDao.promissDao(sql, [goodId], function (err, data) {
                            }).then(function (data) {
                                let imgArr = []
                                for (item of data) {
                                    imgArr.push(item.goodImage)
                                }
                                log(imgArr)
                                let delImg = []
                                for (let i = 0; i < data.length; i++) {
                                    if (goodListImg.indexOf(data[i].goodImage) < 0) {
                                        delImg.push(data[i].imgId)
                                    }
                                }
                                log(delImg)
                                for (let i = 0; i < goodListImg.length; i++) {
                                    for (let j = 0; j < imgArr.length; j++) {
                                        if (goodListImg[i] == imgArr[j]) {
                                            goodListImg.splice(i, 1)
                                        }
                                    }
                                }
                                log(goodListImg)
                                if (delImg.length > 0) {
                                    arr = [delImg[0]]
                                    sql = 'delete from goodimgs where imgId=? '
                                    for (let i = 1; i < delImg.length; i++) {
                                        sql += ` or imgId= ?`
                                        arr.push(delImg[i])
                                    }
                                    promissDao.promissDao(sql, arr, function (err, data) {
                                    }).then(function () {
                                        if (goodListImg.length > 0) {
                                            arr = []
                                            sql = 'insert into goodimgs values'
                                            for (let i = 0; i < goodListImg.length - 1; i++) {
                                                sql += `(null,?,?),`
                                                arr.push(goodId)
                                                arr.push(goodListImg[i])
                                            }
                                            sql += `(null,?,?)`
                                            arr.push(goodId)
                                            arr.push(goodListImg[goodListImg.length - 1])
                                            promissDao.promissDao(sql, arr, function (err, data) {
                                                if (data) {
                                                    resp.send({ code: 200 })
                                                } else {
                                                    log(err)
                                                }
                                            })
                                        } else {
                                            resp.send({ code: 200 })
                                        }
                                    }).catch(function (err) {
                                        log(err)
                                    })
                                } else {
                                    if (goodListImg.length > 0) {
                                        arr = []
                                        sql = 'insert into goodimgs values'
                                        for (let i = 0; i < goodListImg.length - 1; i++) {
                                            sql += `(null,?,?),`
                                            arr.push(goodId)
                                            arr.push(goodListImg[i])
                                        }
                                        sql += `(null,?,?)`
                                        arr.push(goodId)
                                        arr.push(goodListImg[goodListImg.length - 1])
                                        promissDao.promissDao(sql, arr, function (err, data) {
                                            if (data) {
                                                resp.send({ code: 200 })
                                            } else {
                                                log(err)
                                            }
                                        })
                                    } else {
                                        resp.send({ code: 200 })
                                    }
                                }

                            }).catch(function (err) {
                                log(err)
                            })
                        } else {
                            log(err)
                        }
                    })
                }).catch(function (err) {
                    log(err)
                })
            }).catch(function (err) {
                log(err)
            })
        } else {
            arr.push(kind)
            arr.push(goodId)
            promissDao.promissDao(sql, arr, function (err, data) {
                if (data) {
                    sql = 'select * from goodimgs where goodId=?'
                    promissDao.promissDao(sql, [goodId], function (err, data) {
                    }).then(function (data) {
                        let imgArr = []
                        for (item of data) {
                            imgArr.push(item.goodImage)
                        }
                        log(imgArr)
                        let delImg = []
                        for (let i = 0; i < data.length; i++) {
                            if (goodListImg.indexOf(data[i].goodImage) < 0) {
                                delImg.push(data[i].imgId)
                            }
                        }
                        log(delImg)
                        for (let i = 0; i < goodListImg.length; i++) {
                            for (let j = 0; j < imgArr.length; j++) {
                                if (goodListImg[i] == imgArr[j]) {
                                    goodListImg.splice(i, 1)
                                }
                            }
                        }
                        log(goodListImg)
                        if (delImg.length > 0) {
                            arr = [delImg[0]]
                            sql = 'delete from goodimgs where imgId=? '
                            for (let i = 1; i < delImg.length; i++) {
                                sql += ` or imgId= ?`
                                arr.push(delImg[i])
                            }
                            promissDao.promissDao(sql, arr, function (err, data) {
                            }).then(function () {
                                if (goodListImg.length > 0) {
                                    arr = []
                                    sql = 'insert into goodimgs values'
                                    for (let i = 0; i < goodListImg.length - 1; i++) {
                                        sql += `(null,?,?),`
                                        arr.push(goodId)
                                        arr.push(goodListImg[i])
                                    }
                                    sql += `(null,?,?)`
                                    arr.push(goodId)
                                    arr.push(goodListImg[goodListImg.length - 1])
                                    promissDao.promissDao(sql, arr, function (err, data) {
                                        if (data) {
                                            resp.send({ code: 200 })
                                        } else {
                                            log(err)
                                        }
                                    })
                                } else {
                                    resp.send({ code: 200 })
                                }
                            }).catch(function (err) {
                                log(err)
                            })
                        } else {
                            if (goodListImg.length > 0) {
                                arr = []
                                sql = 'insert into goodimgs values'
                                for (let i = 0; i < goodListImg.length - 1; i++) {
                                    sql += `(null,?,?),`
                                    arr.push(goodId)
                                    arr.push(goodListImg[i])
                                }
                                sql += `(null,?,?)`
                                arr.push(goodId)
                                arr.push(goodListImg[goodListImg.length - 1])
                                promissDao.promissDao(sql, arr, function (err, data) {
                                    if (data) {
                                        resp.send({ code: 200 })
                                    } else {
                                        log(err)
                                    }
                                })
                            } else {
                                resp.send({ code: 200 })
                            }
                        }

                    }).catch(function (err) {
                        log(err)
                    })
                } else {
                    log(err)
                }
            })
        }
    },
    getRecord(req, resp) {
        let sql = 'SELECT category,sellNum FROM goods join categories on categories.categoryId=goods.categoryId '
        let arr = []
        let reportData = {}
        let categoryName = []
        dataDao.dataDao('select * from categories', [], function (err, data) {
            if (data) {
                let categories = data
                for (item of categories) {
                    categoryName.push(item.category)
                }
                dataDao.dataDao(sql, arr, function (err, data) {
                    if (data) {
                        let sellData = []
                        for (let i = 0; i < categoryName.length; i++) {
                            let sellNum = 0
                            for (let j = 0; j < data.length; j++) {
                                if (categoryName[i] == data[j].category) {
                                    sellNum += data[j].sellNum
                                }
                            }
                            sellData.push({ category: categoryName[i], sellNum: sellNum })
                        }
                        reportData = { sellData }
                        resp.send(reportData)
                    } else {
                        log(err)
                    }
                })

            } else {
                log(err)
            }
        })

    },
    getIndexData(req, resp) {
        let indexData = {}
        let { time1, time2 } = req.body
        let sql = ''
        dataDao.dataDao('select address,lngLat from users', [], function (err, data) {
            if (data) {
                let position = data
                sql = "select count(*)as regNum from users where regTime=?"
                dataDao.dataDao(sql, [time1], function (err, data) {
                    if (data) {
                        let regNum = data[0].regNum
                        sql = 'select count(*)as orderNum from orders where state="已付款" and orderDate=?'
                        dataDao.dataDao(sql, [time1], function (err, data) {
                            if (data) {
                                let orderNum = data[0].orderNum
                                sql = 'select  count(*)as shelveNum  from goods where shelveTime=?'
                                dataDao.dataDao(sql, [time1], function (err, data) {
                                    if (data) {
                                        let shelveNum = data[0].shelveNum
                                        sql = 'select  count(*)as appointNum  from appointment where appointDate=?'
                                        dataDao.dataDao(sql, [time1], function (err, data) {
                                            if (data) {
                                                let appointNum = data[0].appointNum
                                                indexData = { position, regNum, orderNum, shelveNum, appointNum }
                                                resp.send(indexData)
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
                    } else {
                        log(err)
                    }
                })
            } else {
                log(err)
            }
        })
    },
    processOrder(req, resp) {
        let { orderCode } = req.body
        dataDao.dataDao('update orders set isProcessed="已接收" where orderCode=?', [orderCode], function (err, data) {
            if (data) {
                resp.send({ code: 200 })
            } else {
                log(err)
            }
        })
    }
}
module.exports = myCtrl