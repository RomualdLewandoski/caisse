$('#closeLogView').click(function (event) {
    event.preventDefault()
    closeLogView()
})

function closeLogView(){
    removeBoxList("#logView")
    $('#logView').remove();
}


function loadLog() {
    let id = $('#logView').attr('data-id');
    knex.select().table('Logs').where('idLog', id).then((r) => {
        if (r.length == 0) {
            closeLogView()
            swal('Erreur', "Il semblerait que ce log n'existe pas", "error")
        }else{
            let log = r[0]
            $('#autorLog').append(log.userLog)
            $('#dateLog').append(log.dateLog)
            $('#typeLog').append(log.typeLog)
            $('#actionLog').append(log.actionLog)
            $('#diffLog').append(log.diff)
        }
    })
}