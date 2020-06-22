async function getDelete(obj, isTest = false, db = null, maps = null, upd = null) {
    if (isTest){
        knex = db
        updater = upd
        deleteList = maps.deleteList
        permsMap = maps.permsMap
        suppliersMap = maps.suppliersMap
        usersMap = maps.usersMap

    }
    let x
    for (x in obj.delete) {
        let deleteLog = obj.delete[x]
        if (!deleteList.has(deleteLog.id)) {
            let temp = updater.getTable(deleteLog.typeDelete)
            table = temp.table
            idWp = temp.idWp
            let req = knex(table).where(idWp, deleteLog.targetId).delete()
            await req.then(async (r) => {
                switch (deleteLog.typeDelete.toLowerCase()) {
                    case "permissionmodel":
                        permsMap.delete(parseInt(deleteLog.targetId))
                        break;
                    case "suppliermodel":
                        suppliersMap.delete(parseInt(deleteLog.targetId))
                        break;
                    case "usermodel":
                        usersMap.delete(parseInt(deleteLog.targetId))
                        break;
                }

                deleteList.add(deleteLog.id)
                 knex("Delete").insert({id: deleteLog.id}).then(() => {
                })
            }).catch((err) => {
                if (!isTest){
                    let __OBFID = "1878c636-291b-4079-93fc-aa82290a1001"
                    errorHelper.log("Delete entry on local base due to a delete from server", __OBFID, err)
                }else{
                    console.log(err)
                }

            })
        }
    }
    if (isTest){
        return {
            deleteList: deleteList,
            permsMap: permsMap,
            suppliersMap: suppliersMap,
            usersMap: usersMap
        }
    }
}

module.exports = {
    getDelete
}