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
                                    errorHelper.log("insert perms model", err)
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
                                    errorHelper.log("update perms model", err)
                                })
                        }
                    }).catch((err) => {
                    errorHelper.log("select perms model from local base", err)
                })
            }
            return true;
        }).catch((err) => {
            errorHelper.log("API call for get perms", err)
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
                                    errorHelper.log("insert user ", err)
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
                                    errorHelper.log("update user ", err)
                                })
                        }
                    }).catch((err) => {
                    errorHelper.log("select users from local base", err)
                })
            }
            return true;
        }).catch((err) => {
            errorHelper.log("Api call for get users", err)
        })
    }
}

module.exports.getSuppliers = function () {

}

module.exports.getLogs = function () {

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