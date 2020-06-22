async function getLogs(obj) {
    let x;
    for (x in obj.logs) {
        let log = obj.logs[x];
        if (!logList.has(parseInt(log.idLog))) {
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
                console.log("LOG INSERT OK")
                logList.add(parseInt(log.idLog))
            }).catch((err) => {
                let __OBFID = "f28914e6-e03a-4a5b-b996-00e111c2df83"
                errorHelper.log("Insert log", __OBFID, err)
            })
        }
    }
}

async function getLogId(obj) {
    var log = obj.logs
    if (!logList.has(parseInt(log.idLog))) {
        await knex('Logs').insert({
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
            console.log("INSERT OK getOneLog")
        }).catch((err) => {
            let __OBFID = "06b44f58-77be-4e52-abe6-51eef4081f0c"
            errorHelper.log("Insert last log", __OBFID, err)
        })
    }
}

module.exports = {
    getLogs,
    getLogId
}