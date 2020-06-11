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
        let __OBFID = "81023b9f-06a7-4a80-8d9f-1ccf5dfd06b6"
        errorHelper.log("Get user by Name Login ", __OBFID, err)
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
                let __OBFID = "b5301b75-5280-471f-a46d-66d3dd37c328"
                errorHelper.log("Get user by idWp Login ", __OBFID, err)
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
        let __OBFID = "6026ead9-36f4-4e1c-8205-6ff78ec20f6d"
        errorHelper.log("Updating UserPassword ", __OBFID, err)
        ret = {
            state: false
        }
    })
    let connection;
    await apiHelper.isOnline().then((r) => {
        connection = r
    })

    if (ret.state) {
        let value = {
            idWp: idWp,
            newPass: hash,
            loginUserName: user.usernameShopLogin
        }
        updater.addToThread("user", "editpass", value).then(() => {
            if (connection){
                updater.doUpdate().then(() => {})
            }
        }).catch((err) => {
            let __OBFID = "fec320d0-8b7c-4074-95a0-921c56a45044"
            errorHelper.log("addToThread for edit password " + JSON.stringify(value), __OBFID, err)
        })
    }

    return ret;
}

