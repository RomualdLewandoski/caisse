var connection;
var getPerms = module.exports.getPerms = async function getPerms() {
    await isOnline().then((r) => {
        connection = r
    })
    if (!connection) {
        swal("Attention", "Impossible d'établire la connexion avec le site, la caisse fonctionne en mode Hors ligne", "warning");
    } else {
        var request = post(configObj.host, getSlug(configObj.host, "api/perms"), {apiKey: configObj.privateKey});
        request.then(function (response) {
            var obj = JSON.parse(response);
            let x;
            for (x in obj.perms) {
                let perm = obj.perms[x]
                knex.select().table('PermissionModel')
                    .where('idWp', perm.idPermissionModel)
                    .then((r) => {
                        if (r.length == 0) {
                            knex('PermissionModel').insert({
                                idWp: perm.idPermissionModel,
                                namePermissionModel: perm.namePermissionModel,
                                hasAdmin: perm.hasAdmin,
                                hasCompta: perm.hasCompta,
                                hasProductManagement: perm.hasProductManagement,
                                hasSupplierManagement: perm.hasSupplierManagement,
                                hasStock: perm.hasStock,
                                hasCaisse: perm.hasCaisse
                            }).then((r) => {
                                console.log("INSERT OK")
                            })
                                .catch((err) => {
                                    let __OBFID = "ce4bdd9a-7d6e-4dbd-b6c6-78b76fb22f0b"
                                    errorHelper.log("insert perms model", __OBFID, err)
                                })
                        } else {
                            //on va update
                            knex('PermissionModel').where('idWp', perm.idPermissionModel)
                                .update({
                                    namePermissionModel: perm.namePermissionModel,
                                    hasAdmin: perm.hasAdmin,
                                    hasCompta: perm.hasCompta,
                                    hasProductManagement: perm.hasProductManagement,
                                    hasSupplierManagement: perm.hasSupplierManagement,
                                    hasStock: perm.hasStock,
                                    hasCaisse: perm.hasCaisse
                                }).then((r) => {
                                console.log("UPDATE COMPLETE")
                            })
                                .catch((err) => {
                                    let __OBFID = "ea91b249-7edb-4d57-9ba2-619f3b275bd0"
                                    errorHelper.log("update perms model", __OBFID, err)
                                })
                        }
                    }).catch((err) => {
                    let __OBFID = "adb9f160-6075-40f2-9139-d8fd037c178c"
                    errorHelper.log("select perms model from local base", __OBFID, err)
                })
            }
            return true;
        }).catch((err) => {
            let __OBFID = "28224b97-ec3c-414b-aa01-4fa8b85692d8"
            errorHelper.log("API call for get perms", __OBFID, err)
            return false;
        })
    }
}

var getUser = module.exports.getUsers = async function getUsers() {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/users"), {apiKey: configObj.privateKey})
        request.then(function (response) {
            var obj = JSON.parse(response)
            let x;
            for (x in obj.users) {
                let user = obj.users[x]
                //first select THEN insert OR UPDATE
                knex().select().table("ShopLogin").where('idWp', user.idShopLogin)
                    .then((r) => {
                        if (r.length == 0) {
                            knex('ShopLogin').insert({
                                idWp: user.idShopLogin,
                                usernameShopLogin: user.usernameShopLogin,
                                passwordShopLogin: user.passwordShopLogin,
                                hasAdmin: user.hasAdmin,
                                hasCompta: user.hasCompta,
                                hasProductManagement: user.hasProductManagement,
                                hasSupplierManagement: user.hasSupplierManagement,
                                hasStock: user.hasStock,
                                hasCaisse: user.hasCaisse,
                                isDefaultPass: user.isDefaultPass
                            }).then((r) => {
                                console.log("INSERT OK")
                            })
                                .catch((err) => {
                                    let __OBFID = "cdc60eef-a790-441d-80e0-99ccf7ac17dc"
                                    errorHelper.log("insert user ", __OBFID, err)
                                })
                        } else {
                            knex('ShopLogin').where('idWp', user.idShopLogin)
                                .update({
                                    usernameShopLogin: user.usernameShopLogin,
                                    passwordShopLogin: user.passwordShopLogin,
                                    hasAdmin: user.hasAdmin,
                                    hasCompta: user.hasCompta,
                                    hasProductManagement: user.hasProductManagement,
                                    hasSupplierManagement: user.hasSupplierManagement,
                                    hasStock: user.hasStock,
                                    hasCaisse: user.hasCaisse,
                                    isDefaultPass: user.isDefaultPass
                                }).then((r) => {
                                console.log("UPDATE COMPLETE")
                            })
                                .catch((err) => {
                                    let __OBFID = "f3421fed-10d8-4fb4-a320-01e3ecf67cf6"
                                    errorHelper.log("update user ", __OBFID, err)
                                })
                        }
                    }).catch((err) => {
                    let __OBFID = "6cc42341-b722-4799-98a8-31db20620aa6"
                    errorHelper.log("select users from local base", __OBFID, err)
                })
            }
            return true;
        }).catch((err) => {
            let __OBFID = "ca15fb87-7770-4a22-b226-a23a6be58923"
            errorHelper.log("Api call for get users", __OBFID, err)
            return false
        })
    }
}

var getSuppliers = module.exports.getSuppliers = async function () {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/suppliers"), {apiKey: configObj.privateKey})
        request.then(function (response) {
            var obj = JSON.parse(response);
            let x;
            for (x in obj.suppliers) {
                let supplier = obj.suppliers[x]
                knex().select().table('Supplier').where('idWp', supplier.idSupplier)
                    .then((r) => {
                        if (r.length == 0) {
                            knex('Supplier').insert({
                                idWp: supplier.idSupplier,
                                isSociety: supplier.isSociety,
                                societyName: supplier.societyName,
                                gender: supplier.gender,
                                firstName: supplier.firstName,
                                lastName: supplier.lastName,
                                address: supplier.address,
                                zipCode: supplier.zipCode,
                                city: supplier.city,
                                country: supplier.country,
                                phone: supplier.phone,
                                mobilePhone: supplier.mobilePhone,
                                mail: supplier.mail,
                                refCode: supplier.refCode,
                                webSite: supplier.webSite,
                                paymentType: supplier.paymentType,
                                iban: supplier.iban,
                                bic: supplier.bic,
                                tva: supplier.tva,
                                siret: supplier.siret,
                                contact: supplier.contact,
                                notes: supplier.notes,
                                isActive: supplier.isActive
                            }).then((r) => {
                                console.log("INSERT OK")
                            }).catch((err) => {
                                let __OBFID = "3f7df55c-b143-4181-b05c-5c4c898caeee"
                                errorHelper.log("insert supplier ", __OBFID, err)
                            })
                        } else {
                            knex("Supplier").where('idWp', supplier.idSupplier).update({
                                isSociety: supplier.isSociety,
                                societyName: supplier.societyName,
                                gender: supplier.gender,
                                firstName: supplier.firstName,
                                lastName: supplier.lastName,
                                address: supplier.address,
                                zipCode: supplier.zipCode,
                                city: supplier.city,
                                country: supplier.country,
                                phone: supplier.phone,
                                mobilePhone: supplier.mobilePhone,
                                mail: supplier.mail,
                                refCode: supplier.refCode,
                                webSite: supplier.webSite,
                                paymentType: supplier.paymentType,
                                iban: supplier.iban,
                                bic: supplier.bic,
                                tva: supplier.tva,
                                siret: supplier.siret,
                                contact: supplier.contact,
                                notes: supplier.notes,
                                isActive: supplier.isActive
                            }).then((r) => {
                                console.log("UPDATE COMPLETE")
                            }).catch((err) => {
                                let __OBFID = "a3d9c668-863c-471a-9c60-878c90a36ca1"
                                errorHelper.log("update supplier ", __OBFID, err)
                            })
                        }
                    }).catch((err) => {
                    let __OBFID = "47cc4cb2-02e0-4809-b9bb-ef867e49e2bc"
                    errorHelper.log("select suppliers from local base", __OBFID, err)
                })
            }
            return true
        }).catch((err) => {
            let __OBFID = "c1907528-a22f-4fe9-bfa3-13cf9030ef64"
            errorHelper.log("Api call for get suppliers", __OBFID, err)
            return false
        })
    }
}

module.exports.getLogId = async function (idLog) {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/logs/getId"), {
            apiKey: configObj.privateKey,
            idLog: idLog
        })
        request.then((response) => {
            var obj = JSON.parse(response)
            var log = obj.logs
            knex().select().table('Logs').where('idLog', log.idLog).then((r) => {
                if (r.length == 0) {
                    knex('Logs').insert({
                        idLog: log.idLog,
                        userLog: log.userLog,
                        dateLog: log.dateLog,
                        typeLog: log.typeLog,
                        actionLog: log.actionLog,
                        targetIdLog: log.targetIdLog,
                        beforeLog: log.beforeLog,
                        afterLog: log.afterLog,
                        diff: log.diff
                    }).then(() => {
                        console.log("INSERT OK")
                    }).catch((err) => {
                        let __OBFID = "06b44f58-77be-4e52-abe6-51eef4081f0c"
                        errorHelper.log("Insert last log", __OBFID, err)
                    })
                }
            }).catch((err) => {
                let __OBFID = "fa579b2c-225c-41cc-8a52-580ce8593293"
                errorHelper.log("select log on local base", __OBFID, err)
            })
        }).catch((err) => {
            let __OBFID = "22164f4f-e34e-4afc-9631-ec8046e63a52"
            errorHelper.log("Api Call for get log by id", __OBFID, err)
        })
    }
}

module.exports.getLogs = async function () {
    if (connection) {
        var request = post(configObj.host, getSlug(configObj.host, "api/logs"), {apiKey: configObj.privateKey})
        request.then(function (response) {

            var obj = JSON.parse(response);
            let x;
            for (x in obj.logs) {
                let log = obj.logs[x];
                knex().select().table('Logs').where('idLog', log.idLog)
                    .then((r) => {
                        if (r.length == 0) {
                            knex('Logs').insert({
                                idLog: log.idLog,
                                userLog: log.userLog,
                                dateLog: log.dateLog,
                                typeLog: log.typeLog,
                                actionLog: log.actionLog,
                                targetIdLog: log.targetIdLog,
                                beforeLog: log.beforeLog,
                                afterLog: log.afterLog,
                                diff: log.diff
                            }).then((r) => {
                                console.log("INSERT OK")
                            }).catch((err) => {
                                let __OBFID = "f28914e6-e03a-4a5b-b996-00e111c2df83"
                                errorHelper.log("Insert log", __OBFID, err)
                            })
                        }
                    }).catch((err) => {
                    let __OBFID = "9db83bcc-3d60-4376-867b-77dcfa07913b"
                    errorHelper.log("Select Logs from local base", __OBFID, err)
                })
            }
            return true;
        }).catch((err) => {
            let __OBFID = "b6802571-7bee-430c-864a-02b1007d5aac"
            errorHelper.log("Api call for get logs", __OBFID, err)
            return false;
        })
    }
}

module.exports.getProducts = function () {

}

var isOnline = module.exports.isOnline = async function isOnline() {
    let plop
    var request = post(configObj.host, getSlug(configObj.host, "api"), {apiKey: configObj.privateKey})
    await request.then((data) => {
        var obj = JSON.parse(data);
        if (obj == null) {
            plop = false
        } else {
            plop = true
        }
    }).catch((err) => {
        plop = false
    })
    return plop
}

var post = module.exports.post = async function post(host, slug, args) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: host + slug,
            type: 'POST',
            data: args,
            dataType: 'text',
            async: false,
            timeout: 50,
            success: (response) => {
                resolve(response)
            },
            error: (response) => {
                reject(response)
            }
        })
    })
}

var getSlug = module.exports.getSlug = function getSlug(host, slug) {
    return host.endsWith('/') ? slug : "/" + slug;
}