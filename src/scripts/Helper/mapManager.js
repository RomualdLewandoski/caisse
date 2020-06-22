async function loadLog(){
    let request = knex().select().table('Logs');
    await request.then((r) => {
        if (r.length != 0){
            let x
            for(x in r){
                let row = r[x];
                if (!logList.has(row.idLog)){
                    logList.add(row.idLog)
                }
            }
        }
    })
}


async function loadSuppliers(){
    let request = knex().select().table('Supplier')
    await request.then((r) => {
        if (r.length != 0){
            let x
            for(x in r){
                let row = r[x]
                if(!suppliersMap.has(row.idWp)){
                    suppliersMap.set(row.idWp, row.version)
                }
            }
        }
    })
}

module.exports = {
    loadLog,
    loadPerms,
    loadSuppliers
}