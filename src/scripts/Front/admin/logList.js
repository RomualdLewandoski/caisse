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
        console.log(r)
        for (x in r) {
            let row = r[x]
            let rowNode = table.row.add([
                    row.idLog,
                    row.userLog,
                    row.typeLog,
                    row.actionLog,
                    row.dateLog,
                    `<button id='showLog' class='btn btn-success' onclick="openLog(` + row.idLog + `)"> Voir </button> `+
                    `<button id='rollbackLog' class='btn btn-warning'>Rollback</button>`
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

function rollbackLog(id) {

}
