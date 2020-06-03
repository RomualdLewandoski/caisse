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

async function doUpdate() {
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
            var req = apiHelper.post(configObj.host, apiHelper.getSlug(configObj.host, "api/updater"), {
                apiKey: configObj.privateKey,
                type: row.type,
                action: row.action,
                value: row.value
            });
            await req.then(async (result) => {
                let obj = JSON.parse(result)
                if (obj.state == 0) {
                    let __OBFID = "3199c6fd-8ba0-4e2d-a3ea-dcde2ebe44df"
                    errorHelper.log("Api updater send error", __OBFID, obj.error)
                } else {
                    if (obj.action == "AddSupplier") {
                        knex("Supplier").where('societyName', obj.societyName).update({
                            idWp: obj.idWp
                        }).then((r) => {
                        }).catch((err) => {
                            let __OBFID = "755a7da5-c814-4ad9-80b7-5ace8de34356"
                            errorHelper.log("Api updater update idWp for add supplier", __OBFID, err)
                        })
                    }
                    //fixme this is not a good solution perhaps we ll handle an error system here
                    await knex.delete().table('updatePending').where('id', row.id).then(() => {
                    }).catch((err) => {
                        let __OBFID = "754e41b2-06c4-49a5-8957-bc7d57db2f85"
                        errorHelper.log("Error while deleting on UpdatePending for " + row, __OBFID, err)
                    })
                }
            }).catch((err) => {
                let __OBFID = "439b3e9e-dcb6-4e01-9490-b587d464abb2"
                errorHelper.log("updater contact api/updater", __OBFID,err)
            })
        }
    }

}

module.exports = {
    createTables,
    updateLoop,
    doUpdate
}