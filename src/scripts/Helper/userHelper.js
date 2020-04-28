/**
 * @author: Romuald Detrait
 * @date: 24/04/2020
 * @description: This is the user helper with all function relative to login, password etc.
 */
var loginUser = module.exports.loginUser = async function loginUser(userName, pass) {
    let obj
    let db = knex.select().table('ShopLogin').where('usernameShopLogin', userName).first()
    await db.then((r) => {
        if (r == null) {
            loginFailed();
            obj = {
                state: false
            }
        } else {
            if (r.isDefaultPass) {
                if (pass == r.passwordShopLogin) {
                    sessionGenerate(r)
                    obj = {
                        state: true,
                        default: true
                    }
                } else {
                    loginFailed()
                    obj = {
                        state: false
                    }
                }

            } else {
                if (checkPass(pass, r.passwordShopLogin)) {
                    sessionGenerate(r)
                    obj = {
                        state: true,
                        default: false
                    }
                } else {
                    loginFailed()
                    obj = {
                        state: false
                    }
                }
            }
        }
    }).catch((err) => {
        errorHelper.log("Get user by Name Login ", err)
    })
    return obj
}

var sessionGenerate = exports.sessionGenerate = function (r) {
    idWp = r.idWp
    user = r
    var d = new Date()
    var date = (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + "-" + (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth()) + "-" + d.getFullYear();
    let obj = {
        idWp: idWp,
        date: date
    }
    let session = btoa(JSON.stringify(obj))
    localStorage.setItem('user', session)
}

var getSession = exports.getSession = async function () {
    var session = localStorage.getItem('user')
    var flag
    if (!session) {
        flag = false
    } else {
        let obj = JSON.parse(atob(session));
        var d = new Date()
        var date = (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) + "-" + (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth()) + "-" + d.getFullYear();
        if (obj.date != date) {
            flag = false
        } else {
            let idWp = obj.idWp
            let db = knex.select().table('ShopLogin').where('idWp', idWp).first()
            await db.then((r) => {
                flag = r
            }).catch((err) => {
                errorHelper.log("Get user by idWp Login ", err)
                flag = false
            })
        }
    }
    return flag

}


var loginFailed = exports.loginFailed = function loginFailed() {
    swal('Erreur', "Vos identifiants ne sont pas valides", "error")
}

var checkPass = module.exports.checkPass = function checkPass(password, hash) {
    hash = hash.replace(/^\$2y(.+)$/i, '$2a$1')
    return bcrypt.compareSync(password, hash)
}

var changePass = exports.changePass = async function (idWp, newPass) {
    var ret;

    let hash = bcrypt.hashSync(newPass, 10);
    let db = knex.table('ShopLogin').where('idWp', idWp).update({passwordShopLogin: hash, isDefaultPass: 0})
    await db.then((r) => {
        ret = {
            state: true
        }
    }).catch((err) => {
        errorHelper("Updating UserPassword ", err)
        ret = {
            state: false
        }
    })
    let connection;
    await apiHelper.isOnline().then((r) => {
        connection = r
    })
    if (ret.state == true && connection) {
        var req = apiHelper.post(configObj.host, apiHelper.getSlug(configObj.host, "api/users/changepass"), {
            apiKey: configObj.privateKey,
            idWp: idWp,
            newPass: hash
        });
        await req.then((response) => {
            let r = JSON.parse(response)
            if (r.state == 0) {
                ret = {
                    state: true
                }
            } else {
                ret = {
                    state: false
                }
                errorHelper.log("Error change password api", r.error)
            }
        }).catch((err) => {
            errorHelper.log("Error request api change pass", err)
            ret = {
                state: false
            }
        })
    } else if (ret.state == true && !connection) {
        let value = {
            idWp: idWp,
            newPass: hash
        }
        let str = JSON.stringify(value);
        let db = knex('updatePending').insert({
            type: "user",
            action: "editpass",
            value: btoa(str)
        })
        await db.then((r) => {
            ret = {
                state: true
            }
        }).catch((err) => {
            errorHelper.log("Add to updatePending editPass", err)
            ret = {
                state: false
            }
        })
    }

    return ret;
}

