$('#closeLogList').click(function (event) {
    event.preventDefault()
    removeBoxList("#logList")
    $('#logList').remove();
})
$('#refreshLogList').click(function (event) {
    event.preventDefault()
    loadLogs();
})

function loadLogs() {
    let table = $('#logListTable').DataTable()
    table.clear()
    knex().select().table("Logs").orderBy("dateLog", "ASC").then((r) => {
        let x;
        for (x in r) {
            let row = r[x]
            let rowNode = table.row.add([
                    row.idLog,
                    row.userLog,
                    row.typeLog,
                    row.actionLog,
                    row.dateLog,
                    `<button id='showLog' class='btn btn-success' onclick="openLog(` + row.idLog + `)"> Voir </button> ` +
                    `<button id='rollbackLog' class='btn btn-warning' onclick="rollbackLog(` + row.idLog + `)">Rollback</button>`
                ]
            ).draw().node()
            if (row.actionLog == "Create") {
                $(rowNode).addClass("alert-success")
            } else if (row.actionLog == "Edit") {
                $(rowNode).addClass("alert-warning")
            } else if (row.actionLog == "Delete") {
                $(rowNode).addClass("alert-danger")
            }
        }
    })

}

function openLog(id) {
    showBox(logView, true, id)
    setTimeout(toggleBox(logView.div), 300)
}

async function rollbackLog(id) {
    let data = {
        idLog: id,
        loginUserName: user.usernameShopLogin
    }
    let connection;
    await apiHelper.isOnline().then((r) => {
        connection = r
    })
    updater.addToThread("log", "rollback", data).then((r) => {
        if (r) {
            if (connection) {
                updater.doUpdate().then(() => {
                })
            }
            swal('Succès', "Le log a bien été rollback", "success")
        } else {
            swal("Attention", "Le log n'as pas été rollback car la mise a jour site n'as pu etre effectuée", "error");
        }
    }).catch((err) => {
        let __OBFID = "7cf362f7-58a2-4d20-8db2-5c447e7a0f9f"
        errorHelper.log("addToThread for rollbackLog", __OBFID, err)
    })
}
