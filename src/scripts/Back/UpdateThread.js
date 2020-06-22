function createTables() {
    knex.schema.createTableIfNotExists("updatePending", function (table) {
        table.increments('id');
        table.string("type");
        table.string("action");
        table.text("value")
    }).then(() => {
    }).catch((err) => {
        let __OBFID = "da109008-e54d-4459-beae-c9af12fb8205"
        errorHelper.log("Creating UpdatePending ", __OBFID, err)
    })
}

async function updateLoop() {
    setInterval(doUpdate, (30 * 1000))
}

async function doUpdate(isloading = false) {
    loggerUpdateThread.log("Call UpdateThread..")

    let connection;
    await apiHelper.isOnline().then((r) => {
        connection = r
    })
    if (connection) {
        let db = knex.select().table('updatePending')
        var obj;
        await db.then((r) => {
            if (r.length != 0) {
                obj = r
            }
        }).catch((err) => {
            let __OBFID = "32f091c1-1a2b-4978-bda8-1bd64d9dce9d"
            errorHelper.log("Update Thread ", __OBFID, err)
        })
        let x;
        for (x in obj) {
            var row = obj[x]
            let getId = await retriveIdWp(row)
            if (getId.state) {
                var req = apiHelper.post(configObj.host, apiHelper.getSlug(configObj.host, "api/updater"), {
                    apiKey: configObj.privateKey,
                    type: row.type,
                    action: row.action,
                    value: getId.value
                })
                await req.then(async (result) => {

                    let obj = JSON.parse(result)
                    if (obj.state == 0) {
                        if (obj.error == "Supplier Not found while trying delete") {
                            alert("Attention le fournisseur n'avais pas d'identiifiant sur le site, il est possible qu'il ai déja été supprimé ")
                        } else {
                            let __OBFID = "3199c6fd-8ba0-4e2d-a3ea-dcde2ebe44df"
                            errorHelper.log("Api updater send error", __OBFID, obj.error)
                        }
                        await deleteLog(row)
                    } else {
                        if (obj.action == "AddSupplier") {
                            suppliers.set(parseInt(obj.idWp), "1970-01-01")
                            knex("Supplier").where('societyName', obj.societyName).update({
                                idWp: obj.idWp
                            }).then((r) => {
                            }).catch((err) => {
                                let __OBFID = "755a7da5-c814-4ad9-80b7-5ace8de34356"
                                errorHelper.log("Api updater update idWp for add supplier", __OBFID, err)
                            })
                        } else if (obj.action == "delete") {
                            let table, idWp;
                            let temp = getTable(obj.type);
                            if (temp != null) {
                                table = temp.table
                                idWp = temp.idWp
                                let req = knex(table).where(idWp, obj.targetIdLog).delete()
                                await req.then(() => {
                                    switch (obj.type.toLowerCase()) {
                                        case "permissionmodel":
                                            permsMap.delete(parseInt(obj.targetIdLog))
                                            break;
                                        case "suppliermodel":
                                            suppliers.delete(parseInt(obj.targetIdLog))
                                            break;
                                        case "usermodel":
                                            usersMap.delete(parseInt(obj.targetIdLog))
                                            break;
                                    }
                                }).catch((err) => {
                                    let __OBFID = "2a4fd490-fba8-435c-8f6f-b190dfe791a1"
                                    errorHelper.log("Delete entry after rollback", __OBFID, err)
                                })
                            }

                        }
                        await apiHelper.getLogId(obj.idLog).then(() => {
                            apiHelper.getLogs().then(() => {
                                console.log("Update Logs from site")
                            })
                        })
                        await deleteLog(row)
                    }
                }).catch((err) => {
                    let __OBFID = "439b3e9e-dcb6-4e01-9490-b587d464abb2"
                    errorHelper.log("updater contact api/updater", __OBFID, err)
                })
            } else {
                await deleteLog(row)
            }

        }
        if (!isloading) {
            apiHelper.getPerms().then(() => {
            })
            apiHelper.getUsers().then(() => {
            })
            apiHelper.getSuppliers().then(() => {
            })
            apiHelper.getDelete().then(() => {
            })
        }

    }

}

async function deleteLog(row) {
    await knex.delete().table('updatePending').where('id', row.id).then(() => {
    }).catch((err) => {
        let __OBFID = "754e41b2-06c4-49a5-8957-bc7d57db2f85"
        errorHelper.log("Error while deleting on UpdatePending for " + row, __OBFID, err)
    })
}

async function retriveIdWp(row) {
    let value = row.value
    let action = row.action
    let type = row.type
    let obj = JSON.parse(atob(value))
    let ret = true;
    switch (action) {
        case "edit":
        case "delete":
            if (obj.idWp == null || obj.idWp == undefined) {
                switch (type) {
                    case "supplier":
                        let req = knex().select().table("Supplier").where('idSupplier', obj.idLocal)
                        await req.then(async (r) => {
                            if (r.length == 0) {
                                let del = knex("Supplier").delete().where('idSupplier', obj.idLocal)
                                await del.then(() => {
                                    ret = false;
                                }).catch((err) => {
                                    ret = false
                                    let __OBFID = "5d8a92b6-934c-4af2-aea2-d624617a299f"
                                    errorHelper.log("UpdateThread remove entry cause no idWp found", __OBFID, err)
                                })
                            } else {
                                obj.idWp = r[0].idWp
                                delete obj.idLocal
                            }
                        }).catch((err) => {
                            ret = false
                            let __OBFID = "1869c676-1a3a-4894-a1e2-2b2c5c0e3b96"
                            errorHelper.log("UpdateThread select to get idWp", __OBFID, err)
                        })
                        break;
                }
            } else {
                delete obj.idLocal
            }
            break;
        default:
            delete obj.idLocal
            break;
    }
    return {
        state: ret,
        value: btoa(JSON.stringify(obj))
    }
}

async function addToThread(type, action, value) {
    let str = JSON.stringify(value)
    let ret;
    let update = knex("updatePending").insert({
        type: type,
        action: action,
        value: btoa(str)
    })
    await update.then(() => {
        ret = true
    }).catch((err) => {
        ret = false
        let __OBFID = "4715b7d7-9e51-4779-bf0e-7eb3483279cb"
        errorHelper.log("Add to thread for " + type + " " + action + " " + str, __OBFID, err)
    })
    return ret
}

function getTable(type) {
    type = type.toLowerCase();
    let data;
    switch (type) {
        case "permissionmodel":
            data = {table: "PermissionModel", idWp: "idWp", type: "permissionmodel"}
            break
        case "suppliermodel":
            data = {table: "Supplier", idWp: "idWp", type: "suppliermodel"}
            break
        case "usermodel":
            data = {table: "ShopLogin", idWp: "idWp", type: "usermodel"}
            break
        default:
            data = null
    }
    return data
}

module.exports = {
    createTables,
    updateLoop,
    doUpdate,
    addToThread,
    getTable
}