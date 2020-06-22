/**
 @todo heres come all operation for permsManager
 */

async function getPerms(obj, isTest = false, mapPerms = null, db = null) {
    if (isTest) {
        permsMap = mapPerms;
        knex = db
    }
    let x;
    for (x in obj.perms) {
        let perm = obj.perms[x]
        if (!permsMap.has(parseInt(perm.idPermissionModel))) {
            await knex('PermissionModel').insert({
                idWp: perm.idPermissionModel,
                namePermissionModel: perm.namePermissionModel,
                hasAdmin: perm.hasAdmin,
                hasCompta: perm.hasCompta,
                hasProductManagement: perm.hasProductManagement,
                hasSupplierManagement: perm.hasSupplierManagement,
                hasStock: perm.hasStock,
                hasCaisse: perm.hasCaisse,
                version: perm.version
            }).then((r) => {
                if (!isTest) {
                    console.log("PERMS INSERT OK")
                }
                permsMap.set(parseInt(perm.idPermissionModel), perm.version)
            })
                .catch((err) => {
                    if (!isTest) {
                        let __OBFID = "ce4bdd9a-7d6e-4dbd-b6c6-78b76fb22f0b"
                        errorHelper.log("insert perms model", __OBFID, err)
                    } else {
                        console.log(err)
                    }

                })
        } else {
            let localVersion = permsMap.get(parseInt(perm.idPermissionModel))
            let localDate = dateUtils.toTimespamp(localVersion);
            let serverDate = dateUtils.toTimespamp(perm.version)
            if (localDate < serverDate) {
                await knex('PermissionModel').where('idWp', perm.idPermissionModel)
                    .update({
                        namePermissionModel: perm.namePermissionModel,
                        hasAdmin: perm.hasAdmin,
                        hasCompta: perm.hasCompta,
                        hasProductManagement: perm.hasProductManagement,
                        hasSupplierManagement: perm.hasSupplierManagement,
                        hasStock: perm.hasStock,
                        hasCaisse: perm.hasCaisse,
                        version: perm.version
                    }).then((r) => {
                        if (!isTest) {
                            console.log("UPDATE COMPLETE")
                        }
                        permsMap.set(parseInt(perm.idPermissionModel), perm.version)
                    })
                    .catch((err) => {
                        if (!isTest) {
                            let __OBFID = "ea91b249-7edb-4d57-9ba2-619f3b275bd0"
                            errorHelper.log("update perms model", __OBFID, err)
                        } else {
                            console.log(err)
                        }
                    })
            }
        }
    }
    if (isTest) {
        return permsMap
    }
}

async function loadPerms(isTest = false, db = null, map){
    if (isTest){
        knex = db
        permsMap = map
    }
    let request = knex().select().table('PermissionModel')
    await request.then((r) => {
        if (r.length != 0){
            let x
            for(x in r){
                let row = r[x];
                if (!permsMap.has(row.idWp)){
                    permsMap.set(row.idWp, row.version)
                }
            }
        }
    })
    if (isTest){
        return permsMap
    }
}

module.exports = {
    getPerms,
    loadPerms
}