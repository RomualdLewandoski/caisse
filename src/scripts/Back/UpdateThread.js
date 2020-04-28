function createTables() {
    knex.schema.createTableIfNotExists("updatePending", function (table) {
        table.increments('id');
        table.string("type");
        table.string("action");
        table.text("value")
    }).then(() => {
    }).catch((err) => {
        errorHelper.log("Creating UpdatePending ", err)
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
            errorHelper.log("Update Thread ", err)
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
            await req.then((result) => {
                if (result.state == 1) {
                    errorHelper.log("Api updater send error", result.error)
                } else {
                    knex.delete().table('updatePending').where('id', row.id).then(() => {
                    }).catch((err) => {
                        errorHelper.log("Error while deleting on UpdatePending for " + row, err)
                    })
                }
            }).catch((err) => {
                errorHelper.log("updater contact api/updater", err)
            })
        }
    }

}

module.exports = {
    createTables,
    updateLoop,
    doUpdate
}