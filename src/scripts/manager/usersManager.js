async function getUsers(obj, isTest = false, map = null, db = null) {
    if (isTest) {
        knex = db
        usersMap = map
    }
    let x;
    for (x in obj.users) {
        let user = obj.users[x]
        //first select THEN insert OR UPDATE
        if (!usersMap.has(parseInt(user.idShopLogin))) {
            await knex('ShopLogin').insert({
                idWp: user.idShopLogin,
                usernameShopLogin: user.usernameShopLogin,
                passwordShopLogin: user.passwordShopLogin,
                hasAdmin: user.hasAdmin,
                hasCompta: user.hasCompta,
                hasProductManagement: user.hasProductManagement,
                hasSupplierManagement: user.hasSupplierManagement,
                hasStock: user.hasStock,
                hasCaisse: user.hasCaisse,
                isDefaultPass: user.isDefaultPass,
                version: user.version
            }).then((r) => {
                if (!isTest) {
                    console.log("USER INSERT OK")
                }
                usersMap.set(parseInt(user.idShopLogin), user.version)
            })
                .catch((err) => {
                    if (isTest) {
                        console.log(err)
                    } else {
                        let __OBFID = "cdc60eef-a790-441d-80e0-99ccf7ac17dc"
                        errorHelper.log("insert user ", __OBFID, err)
                    }
                })
        } else {
            let localVersion = permsMap.get(user.idShopLogin)
            let localDate = dateUtils.toTimespamp(localVersion)
            let serverDate = dateUtils.toTimespamp(user.version)
            if (localDate < serverDate) {
                await knex('ShopLogin').where('idWp', user.idShopLogin)
                    .update({
                        usernameShopLogin: user.usernameShopLogin,
                        passwordShopLogin: user.passwordShopLogin,
                        hasAdmin: user.hasAdmin,
                        hasCompta: user.hasCompta,
                        hasProductManagement: user.hasProductManagement,
                        hasSupplierManagement: user.hasSupplierManagement,
                        hasStock: user.hasStock,
                        hasCaisse: user.hasCaisse,
                        isDefaultPass: user.isDefaultPass,
                        version: user.version
                    }).then((r) => {
                    if (!isTest) {
                        console.log("USER UPDATE COMPLETE")
                    }
                    usersMap.set(parseInt(user.idShopLogin), user.version)
                })
                    .catch((err) => {
                        if (isTest){
                            console.log(err)
                        }else{
                            let __OBFID = "f3421fed-10d8-4fb4-a320-01e3ecf67cf6"
                            errorHelper.log("update user ", __OBFID, err)
                        }

                    })
            }
        }
    }
    if (isTest){
        return usersMap
    }
}

async function loadUsers(isTest = false, db = null, map){
    if (isTest){
        knex = db
        usersMap = map
    }
    let request = knex().select().table('ShopLogin')
    await request.then((r) => {
        if (r.length != 0){
            let x
            for(x in r){
                let row = r[x];
                if (!usersMap.has(row.idWp)){
                    usersMap.set(parseInt(row.idWp), row.version)
                }
            }
        }
    })
    if (isTest){
        return usersMap
    }
}

module.exports = {
    getUsers,
    loadUsers
}